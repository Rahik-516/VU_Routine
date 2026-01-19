/**
 * Application Configuration
 * Update these values to customize the application
 */

// Google Sheets Configuration
export const SHEETS_CONFIG = {
  // The public Google Spreadsheet for VU CSE routine
  SPREADSHEET_ID: '1Sdmr60rcZeBCa2ofswUr9mxIreIj71W9HYM1RRhvfMM',
  
  // Set to true to use CSV export (no API key needed)
  // Set to false to use Google Sheets API v4
  USE_CSV_EXPORT: true,
  
  // Your Google Sheets API key (get from: https://console.cloud.google.com/)
  // Only needed if USE_CSV_EXPORT is false
  API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY',
};

// Application Configuration
export const APP_CONFIG = {
  // Name of the institution
  INSTITUTION_NAME: 'Varendra University',
  
  // Name of the department
  DEPARTMENT_NAME: 'Computer Science and Engineering',
  
  // Semester/Year label
  SEMESTER_LABEL: 'Spring 2026',
  
  // How often to refresh data (in milliseconds)
  REFETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  
  // Maximum number of teacher colors (will cycle after this)
  MAX_COURSE_COLORS: 10,
  
  // Enable/disable features
  FEATURES: {
    SEARCH: true,
    DARK_MODE: true,
    EXPORT_PDF: false, // Coming soon
    EXPORT_IMAGE: false, // Coming soon
    NOTIFICATIONS: false, // Coming soon
  },
};

// UI Configuration
export const UI_CONFIG = {
  // Mobile breakpoint (Tailwind responsive design)
  MOBILE_BREAKPOINT: 768,
  
  // Sidebar width on desktop
  SIDEBAR_WIDTH: 256, // 64 * 4 (Tailwind units)
  
  // Animations enabled
  ANIMATIONS_ENABLED: true,
  
  // Default theme mode ('light' or 'dark')
  DEFAULT_THEME: 'dark',
};
