import axios from 'axios';
import type { RoutineData, Teacher, Lab, CommitteeMember, SemesterTimetable, ClassSession, TimeSlot } from '@/types/index';
import { DAYS, DEFAULT_TIME_SLOTS } from '@/types/index';

// Google Sheets configuration
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '1Sdmr60rcZeBCa2ofswUr9mxIreIj71W9HYM1RRhvfMM';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';

// Alternative: Use public CSV export (no API key needed, but less reliable)
const USE_CSV_EXPORT = true; // Set to false when using API key

interface SheetData {
  values: string[][];
}

/**
 * Fetch a specific range via Google Sheets API (always uses A1 notation)
 */
async function fetchSheetRange(range: string): Promise<string[][]> {
  if (!API_KEY) {
    console.warn(`⚠️ Missing GOOGLE_SHEETS_API_KEY, cannot fetch range ${range}`);
    return [];
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;

  try {
    const response = await axios.get<SheetData>(url);
    const values = response.data.values || [];
    console.log(`🔄 Fetched range ${range}: ${values.length} rows`);
    return values;
  } catch (error) {
    console.error(`❌ Error fetching range ${range}:`, error);
    return [];
  }
}

/**
 * Fetch data from Google Sheets using API v4
 */
async function fetchSheetData(sheetName: string): Promise<string[][]> {
  if (USE_CSV_EXPORT) {
    // Use CSV export endpoint (works without API key for public sheets)
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    try {
      const response = await axios.get(url, {
        responseType: 'text',
      });
      
      console.log(`🔄 Fetched ${sheetName} sheet (${response.data.length} chars)`);
      
      // Parse CSV
      const parsed = parseCSV(response.data);
      console.log(`  ✓ Parsed to ${parsed.length} rows, first row has ${parsed[0]?.length || 0} cols`);
      if (parsed.length > 1 && parsed[1]) {
        console.log(`  Sample cell B2:`, parsed[1][1]?.substring(0, 100));
      }
      
      return parsed;
    } catch (error) {
      console.error(`❌ Error fetching sheet ${sheetName}:`, error);
      throw error;
    }
  } else {
    // Use Google Sheets API v4
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A1:Z100?key=${API_KEY}`;
    
    try {
      const response = await axios.get<SheetData>(url);
      return response.data.values || [];
    } catch (error) {
      console.error(`Error fetching sheet ${sheetName}:`, error);
      throw error;
    }
  }
}

/**
 * Simple CSV parser that handles multi-line cells
 */
function parseCSV(csv: string): string[][] {
  const result: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote within quoted cell
        currentCell += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell);
      currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      // End of row
      currentRow.push(currentCell);
      if (currentRow.some(cell => cell.trim())) {
        result.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      // Skip \r if present (Windows line endings)
      if (csv[i - 1] === '\r') {
        // Already handled
      }
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      // Windows line ending - skip \r, let \n be handled next
      continue;
    } else {
      currentCell += char;
    }
  }
  
  // Add last cell and row if not empty
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(cell => cell.trim())) {
      result.push(currentRow);
    }
  }
  
  return result;
}

/**
 * Parse teacher list from main sheet
 */
function parseTeachers(data: string[][]): Teacher[] {
  const teachers: Teacher[] = [];

  if (!data || data.length === 0) {
    return teachers;
  }

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx] || [];
    const initial = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const designation = (row[2] || '').trim();
    const department = (row[3] || '').trim();
    const university = (row[4] || '').trim();
    const contact = (row[5] || '').trim();
    const email = (row[6] || '').trim();

    const isRowEmpty = [initial, name, designation, department, university, contact, email]
      .every((cell) => cell === '');

    if (isRowEmpty) {
      break; // Stop once we reach the first fully empty row in B-H
    }

    if (!initial || !name) {
      console.warn(`⚠️ Skipping teacher row ${rowIdx + 2}: missing initial or name`);
      continue;
    }

    teachers.push({
      initial,
      name,
      designation,
      department,
      university,
      contact: contact || null,
      email: email || null,
    });
  }

  if (import.meta.env.DEV) {
    console.log('👩‍🏫 Parsed teachers:', teachers);
  }

  return teachers;
}

/**
 * Parse lab information from Info. tab (K-O columns)
 */
function parseLabs(data: string[][]): Lab[] {
  const labs: Lab[] = [];

  if (!data || data.length === 0) {
    return labs;
  }

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx] || [];
    const shortName = (row[0] || '').trim();
    const fullName = (row[1] || '').trim();
    const room = (row[2] || '').trim();
    const inCharge = (row[3] || '').trim();
    const contact = (row[4] || '').trim();

    const isEmptyRow = [shortName, fullName, room, inCharge, contact].every(v => v === '');
    if (isEmptyRow) {
      break; // stop at first fully empty row
    }

    // Skip header-like rows
    const lowerShort = shortName.toLowerCase();
    const lowerFull = fullName.toLowerCase();
    const looksHeader = (lowerShort.includes('lab') || lowerShort.includes('short')) && 
                        (lowerFull.includes('name') || lowerFull.includes('full'));
    if (looksHeader) continue;

    if (!shortName && !fullName) {
      console.warn(`⚠️ Skipping lab row ${rowIdx + 15}: missing both names`);
      continue;
    }

    labs.push({
      shortName,
      fullName,
      room: room || null,
      inCharge: inCharge || null,
      contact: contact || null,
    });
  }

  if (import.meta.env.DEV) {
    console.log('🔬 Parsed labs:', labs);
  }

  return labs;
}

/**
 * Parse routine committee from Info. tab (L-M-N columns)
 */
function parseCommittee(data: string[][]): CommitteeMember[] {
  const committee: CommitteeMember[] = [];

  if (!data || data.length === 0) {
    return committee;
  }

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx] || [];
    const initial = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const contact = (row[2] || '').trim();

    const isEmptyRow = [initial, name, contact].every(v => v === '');
    if (isEmptyRow) {
      break; // stop at first fully empty row
    }

    // Skip header-like rows
    const lowerInit = initial.toLowerCase();
    const lowerName = name.toLowerCase();
    const looksHeader = lowerInit.includes('initial') && lowerName.includes('name');
    if (looksHeader) continue;

    if (!initial && !name) {
      console.warn(`⚠️ Skipping committee row ${rowIdx + 2}: missing initial and name`);
      continue;
    }

    committee.push({
      initial,
      name,
      contact: contact || null,
    });
  }

  if (import.meta.env.DEV) {
    console.log('📋 Parsed committee:', committee);
  }

  return committee;
}

/**
 * Parse semester timetable
 * 
 * SHEET FORMAT:
 * Row 1: Headers (B1:F1 contain slot info with 2 lines: "Slot X" + "HH:MM AM/PM")
 * Column A: Day names (merged cells for each day)
 * Columns B-F: Slot 1-5
 * 
 * Each class cell contains 3 lines:
 *   Line 1: Teacher Name
 *   Line 2: Course Code (Semester + Section)
 *   Line 3: Room: XXX
 * 
 * Multiple classes in one cell = 3 lines per class, consecutive
 */
function parseSemesterTimetable(data: string[][], semesterName: string): SemesterTimetable {
  const classes: ClassSession[] = [];
  const timeSlots: TimeSlot[] = [];
  
  if (!data || data.length < 2) {
    console.warn(`⚠️ ${semesterName}: Insufficient data`);
    return { semester: semesterName, schedule: [], timeSlots: [] };
  }

  console.log(`\n📊 ===== Parsing ${semesterName} =====`);
  console.log(`   Rows: ${data.length}, Cols: ${data[0]?.length || 0}`);

  // STEP 1: Parse slot headers from row 0 (columns B onwards = indices 1-5)
  const headerRow = data[0] || [];
  
  for (let slotIdx = 1; slotIdx <= 5; slotIdx++) {
    const slotHeader = headerRow[slotIdx]?.trim() || '';
    
    let startTime = '';
    let endTime = '';
    
    // Try to parse time range from header (B1:F1) - supports 1 hour or 1.5 hour slots
    // Formats: "8:00-9:00", "8:00 - 9:30", "8:00 AM - 9:30 AM", "Slot 1\n8:00-9:30"
    const rangeMatch = slotHeader.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    
    if (rangeMatch) {
      // Parse start time
      const startHour = parseInt(rangeMatch[1]);
      const startMin = rangeMatch[2];
      const startPeriod = rangeMatch[3]?.toUpperCase();
      
      // Parse end time
      const endHour = parseInt(rangeMatch[4]);
      const endMin = rangeMatch[5];
      const endPeriod = rangeMatch[6]?.toUpperCase();
      
      // Convert to 24-hour format
      let adjustedStartHour = startHour;
      if (startPeriod === 'PM' && startHour !== 12) {
        adjustedStartHour = startHour + 12;
      } else if (startPeriod === 'AM' && startHour === 12) {
        adjustedStartHour = 0;
      }
      
      let adjustedEndHour = endHour;
      if (endPeriod === 'PM' && endHour !== 12) {
        adjustedEndHour = endHour + 12;
      } else if (endPeriod === 'AM' && endHour === 12) {
        adjustedEndHour = 0;
      }
      
      startTime = `${adjustedStartHour.toString().padStart(2, '0')}:${startMin}`;
      endTime = `${adjustedEndHour.toString().padStart(2, '0')}:${endMin}`;
      
      console.log(`  ✓ Slot ${slotIdx}: ${startTime}-${endTime} from sheet`);
    } else {
      // Fallback to DEFAULT_TIME_SLOTS
      const defaultSlots = DEFAULT_TIME_SLOTS;
      if (slotIdx - 1 < defaultSlots.length) {
        startTime = defaultSlots[slotIdx - 1].startTime;
        endTime = defaultSlots[slotIdx - 1].endTime;
      } else {
        startTime = '09:00';
        endTime = '10:00';
      }
      console.warn(`  ⚠️ Slot ${slotIdx}: Using fallback ${startTime}-${endTime} (header: "${slotHeader}")`);
    }
    
    timeSlots.push({
      slot: slotIdx,
      startTime,
      endTime,
    });
  }
  
  console.log(`⏰ Parsed ${timeSlots.length} time slots`);

  // STEP 2: Parse class data starting from row 1
  let currentDay = '';
  
  for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    if (!row || row.length === 0) continue;
    
    // Track current day from column A (handles merged cells)
    const dayCell = row[0]?.trim();
    if (dayCell && dayCell !== '-' && dayCell !== '') {
      currentDay = dayCell;
      console.log(`\n📅 Day: ${currentDay}`);
    }
    
    if (!currentDay) continue;
    
    // Parse each slot (columns B-F = indices 1-5)
    for (let slotIdx = 1; slotIdx <= 5; slotIdx++) {
      const cellContent = row[slotIdx]?.trim();
      if (!cellContent || cellContent === '-') continue;
      
      // Split cell by newlines
      const lines = cellContent.split('\n').map(l => l.trim()).filter(l => l);
      
      // Warn if lines don't divide evenly by 3
      if (lines.length % 3 !== 0) {
        console.warn(`  ⚠️ Row ${rowIdx + 1}, Slot ${slotIdx}: Expected multiples of 3 lines, got ${lines.length}`);
      }
      
      // Process every 3 lines as one class
      for (let i = 0; i + 2 <= lines.length - 1; i += 3) {
        const teacherName = lines[i];
        const line2 = lines[i + 1];
        const line3 = lines[i + 2];
        
        // Parse Line 2: "CSE 3201 (4th Sem. A Sec)"
        // Extract course code (outside parentheses)
        let courseCode = '';
        let semester = '';
        let section = '';
        
        // Find parentheses content
        const parenMatch = line2.match(/\(([^)]+)\)/);
        if (parenMatch) {
          const insideParens = parenMatch[1]; // e.g., "4th Sem. A Sec"
          
          // Extract semester
          const semMatch = insideParens.match(/(\d+\w*)\s+Sem/i);
          if (semMatch) semester = semMatch[1];
          
          // Extract section
          const secMatch = insideParens.match(/([A-Z])\s+Sec/i);
          if (secMatch) section = secMatch[1];
          
          // Course code is everything before the parentheses
          courseCode = line2.substring(0, parenMatch.index).trim();
        } else {
          // No parentheses, entire line2 is course code
          courseCode = line2;
        }
        
        // Parse Line 3: "Room: 311" or just "311"
        let room = '';
        const roomMatch = line3.match(/Room[\s:]*([A-Z0-9]+)/i);
        if (roomMatch) {
          room = roomMatch[1];
        } else {
          // Might be just the room number
          room = line3.replace(/[^A-Z0-9]/gi, '');
        }
        
        if (!courseCode) {
          console.warn(`  ⚠️ Skipping class at row ${rowIdx + 1}, slot ${slotIdx}: no course code`);
          continue;
        }
        
        const timeSlot = timeSlots[slotIdx - 1];
        
        const classSession: ClassSession = {
          courseCode,
          courseName: courseCode,
          teacherInitials: teacherName,
          teacherName: teacherName,
          room,
          section,
          day: currentDay,
          timeSlot: slotIdx,
          startTime: timeSlot?.startTime || '',
          endTime: timeSlot?.endTime || '',
        };
        
        classes.push(classSession);
        
        if (import.meta.env.DEV) {
          console.log(`  ✓ Slot ${slotIdx}: ${courseCode} | ${teacherName} | Sec ${section} | Room ${room}`);
        }
      }
    }
  }
  
  console.log(`✅ Parsed ${classes.length} classes for ${semesterName}\n`);

  // Group by day
  const uniqueDays = Array.from(new Set(classes.map(c => c.day)));
  const schedule = uniqueDays.map(day => ({
    day,
    classes: classes.filter(c => c.day === day),
  }));
  
  return {
    semester: semesterName,
    schedule,
    timeSlots,
  };
}

/**
 * Fetch complete routine data
 */
export async function fetchRoutineData(): Promise<RoutineData> {
  try {
    // Fetch teachers, committee, and labs from Info. tab
    const [teacherRows, committeeRows, labRows] = await Promise.all([
      fetchSheetRange('Info.!B2:H'),
      fetchSheetRange('Info.!L2:N'),
      fetchSheetRange('Info.!K15:O'),
    ]);
    
    const teachers = parseTeachers(teacherRows);
    const labs = parseLabs(labRows);
    const committee = parseCommittee(committeeRows);
    
    // Fetch all semester sheets
    const semesters: { [key: string]: SemesterTimetable } = {};
    
    const semesterNames = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    
    for (const semesterName of semesterNames) {
      try {
        console.log(`📥 Fetching ${semesterName} semester data...`);
        // Use API for semester sheets to preserve newlines in cells
        const semesterData = API_KEY 
          ? await fetchSheetRange(`${semesterName}!A1:F`)
          : await fetchSheetData(semesterName);
        console.log(`📦 Raw data rows for ${semesterName}:`, semesterData.length);
        semesters[semesterName] = parseSemesterTimetable(semesterData, semesterName);
      } catch (error) {
        console.warn(`Could not fetch ${semesterName} semester data:`, error);
        // Create empty timetable
        semesters[semesterName] = {
          semester: semesterName,
          schedule: DAYS.map(day => ({ day, classes: [] })),
          timeSlots: DEFAULT_TIME_SLOTS,
        };
      }
    }
    
    return {
      teachers,
      labs,
      committee,
      semesters,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching routine data:', error);
    throw error;
  }
}

/**
 * Enrich class sessions with full teacher names and course names
 */
export function enrichClassData(
  classes: ClassSession[],
  teachers: Teacher[]
): ClassSession[] {
  return classes.map(classSession => {
    const teacher = teachers.find(t => 
      t.initial.toLowerCase() === classSession.teacherInitials.toLowerCase()
    );
    
    return {
      ...classSession,
      teacherName: teacher?.name,
    };
  });
}
