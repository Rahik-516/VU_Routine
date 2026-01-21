import axios from 'axios';
import type { RoutineData, Teacher, Lab, CommitteeMember, SemesterTimetable, ClassSession, TimeSlot } from '@/types/index';
import { DAYS, DEFAULT_TIME_SLOTS } from '@/types/index';
import { saveOfflineData, getOfflineData } from '@/services/offlineStorage';
import { shouldUseBackup, loadBackupData } from '@/services/excelBackup';

// Google Sheets configuration
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '1Sdmr60rcZeBCa2ofswUr9mxIreIj71W9HYM1RRhvfMM';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';

// Alternative: Use public CSV export (no API key needed, but less reliable)
const USE_CSV_EXPORT = true; // Set to false when using API key

// In-memory cache for parsed semester timetables (session-scoped)
const semesterCache = new Map<string, SemesterTimetable>();

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
    // Use unlimited range (A1:Z will get all data in those columns)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A1:Z?key=${API_KEY}`;
    
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
 * Optimized: single-pass parsing with minimal allocations
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
 * Parse teacher list from Info. sheet (B2:H)
 * 
 * Row 1: Headers title "Teacher's Information"
 * Row 2+: Teacher data
 *   B = Initial, C = Name, D = Designation, E = Department, F = University, G = Contact, H = Email
 * 
 * Parsing rules:
 * - Stop when all cells B-H are empty
 * - Allow missing contact/email (null)
 * - Require both initial and name to be valid
 * - Handle sparse data (continue searching even if empty rows exist)
 */
function parseTeachers(data: string[][]): Teacher[] {
  const teachers: Teacher[] = [];

  if (!data || data.length === 0) {
    console.log('📋 No teacher data to parse');
    return teachers;
  }

  console.log(`🔍 Parsing ${data.length} rows of teacher data...`);
  
  let consecutiveEmptyRows = 0;
  const MAX_CONSECUTIVE_EMPTY = 5; // Allow up to 5 empty rows before stopping

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx] || [];
    const initial = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const designation = (row[2] || '').trim();
    const department = (row[3] || '').trim();
    const university = (row[4] || '').trim();
    const contact = (row[5] || '').trim();
    const email = (row[6] || '').trim();

    const allEmpty = [initial, name, designation, department, university, contact, email]
      .every((cell) => cell === '');

    if (allEmpty) {
      consecutiveEmptyRows++;
      // Only stop if we have too many consecutive empty rows
      if (consecutiveEmptyRows > MAX_CONSECUTIVE_EMPTY) {
        console.log(`⊘ Stopping teacher parsing after ${MAX_CONSECUTIVE_EMPTY} consecutive empty rows`);
        break;
      }
      continue;
    }

    // Reset counter if we found data
    consecutiveEmptyRows = 0;

    // Skip header-like rows
    if (initial.toLowerCase().includes('initial') && name.toLowerCase().includes('name')) {
      if (import.meta.env.DEV) {
        console.log(`  ⊘ Skipping header row`);
      }
      continue;
    }

    // Require at least initial and name
    if (!initial || !name) {
      if (import.meta.env.DEV) {
        console.warn(`  ⚠️ Row ${rowIdx + 1}: Skipping (missing initial or name)`);
      }
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

  console.log(`👩‍🏫 Parsed ${teachers.length} teachers`);
  if (import.meta.env.DEV) {
    console.log('   Teachers:', teachers);
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

  // STEP 1: Parse slot headers from row 0 (columns B onwards)
  // Dynamically detect the number of slots from the header row
  const headerRow = data[0] || [];
  
  // Count how many slot headers exist (start from column B = index 1)
  // Stop when we encounter an empty cell or non-slot content
  let maxSlotIdx = 0;
  for (let idx = 1; idx < headerRow.length; idx++) {
    const cellContent = headerRow[idx]?.trim() || '';
    // Check if this looks like a slot header (contains "Slot" or time info)
    if (cellContent && (cellContent.toLowerCase().includes('slot') || cellContent.includes(':'))) {
      maxSlotIdx = idx;
    } else if (!cellContent && maxSlotIdx > 0) {
      // Stop when we hit an empty cell after finding slots
      break;
    }
  }
  
  // If no slots found, default to 5
  if (maxSlotIdx === 0) {
    maxSlotIdx = 5;
  }
  
  console.log(`🎯 Detected ${maxSlotIdx} slots in header row`);
  
  for (let slotIdx = 1; slotIdx <= maxSlotIdx; slotIdx++) {
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
    
    // Parse each slot dynamically based on the number of time slots detected
    for (let slotIdx = 1; slotIdx <= timeSlots.length; slotIdx++) {
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
        let section = '';
        
        // Find parentheses content
        const parenMatch = line2.match(/\(([^)]+)\)/);
        if (parenMatch) {
          const insideParens = parenMatch[1]; // e.g., "4th Sem. A Sec"
          
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
 * Fetch complete routine data with offline fallback
 * Priority: Google Sheets → Excel Backup → Cached offline data
 */
export async function fetchRoutineData(): Promise<RoutineData> {
  try {
    // Try to fetch from Google Sheets (primary source)
    return await fetchRoutineDataFromSheets();
  } catch (error) {
    console.error('Failed to fetch from Google Sheets:', error);
    
    // Check if this is a network-related error that warrants fallback
    if (shouldUseBackup(error)) {
      console.log('🔄 Attempting Excel backup fallback...');
      const backupData = await loadBackupData();
      if (backupData) {
        console.log('✅ Loaded data from Excel backup');
        return backupData;
      }
    }

    // Final fallback: use cached offline data
    console.log('🔄 Attempting offline cache fallback...');
    const offlineData = getOfflineData();
    if (offlineData) {
      console.log('✅ Loaded data from offline cache (last synced: ' + offlineData.lastUpdated.toLocaleString() + ')');
      return offlineData;
    }

    // No data available at all
    console.error('❌ No data available from any source');
    throw new Error('Unable to load routine data. No internet connection and no cached data available.');
  }
}

/**
 * Fetch complete routine data from Google Sheets
 */
async function fetchRoutineDataFromSheets(): Promise<RoutineData> {
  try {
    // Fetch Info sheet data
    // When no API key, fetch entire Info sheet and extract ranges
    let teacherRows: string[][] = [];
    let committeeRows: string[][] = [];
    let labRows: string[][] = [];

    if (API_KEY) {
      // ALWAYS use API when available - CSV export has row limits
      console.log(`📡 Using Google Sheets API (fetching all data dynamically)`);
      [teacherRows, committeeRows, labRows] = await Promise.all([
        fetchSheetRange('Info.!B2:H'),
        fetchSheetRange('Info.!L2:N'),
        fetchSheetRange('Info.!K15:O'),
      ]);
    } else if (USE_CSV_EXPORT) {
      // Fallback to CSV export only if no API key
      console.log(`📄 Using CSV export (API key not available)`);
      const infoData = await fetchSheetData('Info.');
      console.log(`📊 Info sheet has ${infoData.length} total rows`);
      if (infoData.length > 0) {
        console.log(`   First row columns: ${infoData[0].length}`);
        console.log(`   Sample first row (A1:H1): "${infoData[0].slice(0, 8).join('" | "')}"` );
        if (infoData.length > 2) {
          console.log(`   Sample data row (A3:H3): "${infoData[2].slice(0, 8).join('" | "')}"` );
        }
      }
      
      // Extract teacher rows (columns B-H, starting from row 2)
      // Row 1 (index 0) = Title row
      // Row 2 (index 1) = Header row OR first teacher (depends on sheet)
      // Skip title row, extract from row 2 onwards
      teacherRows = infoData.slice(1).map(row => {
        // Get columns B-H (indices 1-7, but slice is exclusive on end, so 1-8)
        const extracted = row.slice(1, 8);
        // Pad with empty strings if row doesn't have enough columns
        while (extracted.length < 7) {
          extracted.push('');
        }
        return extracted;
      });
      console.log(`👨‍🏫 Extracted ${teacherRows.length} rows for teacher parsing`);
      if (teacherRows.length > 0) {
        console.log(`   First extracted row: "${teacherRows[0].join('" | "')}"` );
        console.log(`   Last extracted row: "${teacherRows[teacherRows.length - 1].join('" | "')}"` );
      }
      
      // Extract committee rows (columns L-N, starting from row 2)
      committeeRows = infoData.slice(1).map(row => {
        const extracted = row.slice(11, 14);
        while (extracted.length < 3) {
          extracted.push('');
        }
        return extracted;
      });
      console.log(`📋 Extracted ${committeeRows.length} rows for committee parsing`);
      
      // Extract lab rows (columns K-O, starting from row 15)
      labRows = infoData.slice(14).map(row => {
        const extracted = row.slice(10, 15);
        while (extracted.length < 5) {
          extracted.push('');
        }
        return extracted;
      });
      console.log(`🔬 Extracted ${labRows.length} rows for lab parsing`);
    } else {
      throw new Error('No data fetching method available (no API key and CSV export disabled)');
    }
    
    const teachers = parseTeachers(teacherRows);
    const labs = parseLabs(labRows);
    const committee = parseCommittee(committeeRows);
    
    // Fetch all semester sheets with caching
    const semesters: { [key: string]: SemesterTimetable } = {};
    const semesterNames = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    
    for (const semesterName of semesterNames) {
      try {
        // Check cache first
        const cached = semesterCache.get(semesterName);
        if (cached) {
          console.log(`✅ Using cached ${semesterName} semester data`);
          semesters[semesterName] = cached;
          continue;
        }

        console.log(`📥 Fetching ${semesterName} semester data...`);
        // Use CSV export when no API key, otherwise use API
        const semesterData = (API_KEY && !USE_CSV_EXPORT)
          ? await fetchSheetRange(`${semesterName}!A1:F`)
          : await fetchSheetData(semesterName);
        console.log(`📦 Raw data rows for ${semesterName}:`, semesterData.length);
        
        const parsed = parseSemesterTimetable(semesterData, semesterName);
        semesterCache.set(semesterName, parsed); // Cache for future requests
        semesters[semesterName] = parsed;
      } catch (error) {
        console.warn(`Could not fetch ${semesterName} semester data:`, error);
        // Create empty timetable
        const empty: SemesterTimetable = {
          semester: semesterName,
          schedule: DAYS.map(day => ({ day, classes: [] })),
          timeSlots: DEFAULT_TIME_SLOTS,
        };
        semesters[semesterName] = empty;
      }
    }
    
    const data: RoutineData = {
      teachers,
      labs,
      committee,
      semesters,
      lastUpdated: new Date(),
    };

    // Save successful fetch to offline storage for future fallback
    saveOfflineData(data);

    return data;
  } catch (error) {
    console.error('Error fetching routine data from Google Sheets:', error);
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
