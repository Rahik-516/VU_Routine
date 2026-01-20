import type { RoutineData } from '@/types/index';

/**
 * Excel backup service
 * Handles fallback loading from Excel file when Google Sheets is unavailable
 * Format: .xlsx or .csv file with the same structure as the Google Sheet
 * 
 * This service expects an Excel file to be available at:
 * /data/routine-backup.xlsx (or .csv)
 * 
 * File structure should match the Google Sheets format:
 * - Info sheet: Teachers, Labs, Committee information
 * - Semester sheets: 1st, 2nd, 3rd, etc.
 */

const BACKUP_FILE_NAME = 'routine-backup';
const BACKUP_PATH = '/data';

/**
 * Check if Excel backup file is available
 * Currently, we check for the file's existence by attempting to fetch it
 */
export async function hasBackupFile(): Promise<boolean> {
  try {
    // Try .xlsx first
    let response = await fetch(`${BACKUP_PATH}/${BACKUP_FILE_NAME}.xlsx`, { method: 'HEAD' });
    if (response.ok) return true;

    // Try .csv as fallback
    response = await fetch(`${BACKUP_PATH}/${BACKUP_FILE_NAME}.csv`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Backup file not available:', error);
    return false;
  }
}

/**
 * Load routine data from Excel backup file
 * This is a placeholder function - actual implementation requires a library
 * like 'xlsx' to parse Excel files. For production, you would:
 * 
 * 1. Install: npm install xlsx
 * 2. Parse the file using XLSX.read()
 * 3. Extract data following Google Sheets format
 * 
 * For now, this returns null to indicate the feature is available
 * but requires setup. When you provide the actual Excel file and
 * uncomment the xlsx dependency, this will work.
 */
export async function loadBackupData(): Promise<RoutineData | null> {
  try {
    const available = await hasBackupFile();
    if (!available) {
      console.log('📋 Excel backup file not available');
      return null;
    }

    console.log('📋 Loading data from Excel backup...');
    
    // This requires installing: npm install xlsx
    // Uncomment when ready to implement:
    /*
    const XLSX = (await import('xlsx')).default;
    
    const fileName = `${BACKUP_PATH}/${BACKUP_FILE_NAME}.xlsx`;
    const response = await fetch(fileName);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Parse sheets following the same format as googleSheets.ts
    // This is a simplified example - you would adapt the parsing logic
    
    const infoSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Info.']);
    // ... continue with other sheets
    
    return parsedData;
    */
    
    console.warn('⚠️ Excel backup: XLSX library not installed. Install with: npm install xlsx');
    return null;
  } catch (error) {
    console.error('Failed to load backup data:', error);
    return null;
  }
}

/**
 * Check if we should use backup due to network error
 */
export function shouldUseBackup(error: any): boolean {
  // Network errors, timeout, or CORS errors
  const errorString = String(error).toLowerCase();
  return (
    errorString.includes('network') ||
    errorString.includes('timeout') ||
    errorString.includes('cors') ||
    errorString.includes('failed to fetch') ||
    !navigator.onLine
  );
}

/**
 * Download and save backup file
 * This is for administrative use to keep the backup current
 * Call this periodically or after data updates
 */
export async function updateBackupFile(): Promise<void> {
  try {
    // This requires installing: npm install xlsx
    console.log('📋 Updating Excel backup with latest data...');
    
    // Uncomment when ready to implement:
    /*
    const XLSX = (await import('xlsx')).default;
    
    // Create workbook structure matching Google Sheets format
    const workbook = XLSX.utils.book_new();
    
    // Add Info sheet with teachers, labs, committee
    // Add semester sheets with timetable data
    
    XLSX.writeFile(workbook, `${BACKUP_FILE_NAME}.xlsx`);
    console.log('✅ Backup file updated');
    */
    
    console.warn('⚠️ Backup update: XLSX library not installed');
  } catch (error) {
    console.error('Failed to update backup file:', error);
  }
}
