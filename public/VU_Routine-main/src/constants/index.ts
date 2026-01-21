/**
 * Constants used throughout the application
 */

export const MESSAGES = {
  // Loading messages
  LOADING_TIMETABLE: 'Loading timetable data...',
  LOADING_TEACHERS: 'Loading teachers...',
  LOADING_LABS: 'Loading lab information...',
  LOADING_COMMITTEE: 'Loading committee information...',
  
  // Error messages
  ERROR_TIMETABLE: 'Failed to load timetable data. Please check your internet connection.',
  ERROR_TEACHERS: 'Failed to load teacher data.',
  ERROR_LABS: 'Failed to load lab data.',
  ERROR_COMMITTEE: 'Failed to load committee data.',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  
  // Success messages
  SUCCESS_UPDATED: 'Data updated successfully',
  
  // Empty states
  EMPTY_TIMETABLE: 'No timetable available for this semester',
  EMPTY_TEACHERS: 'No teacher data available',
  EMPTY_LABS: 'No lab information available',
  EMPTY_COMMITTEE: 'No committee information available',
  NO_NEXT_CLASS: 'No more classes scheduled for today',
};

export const VALIDATION = {
  // Email regex
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Time format regex (HH:MM)
  TIME_REGEX: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  
  // Course code regex
  COURSE_CODE_REGEX: /^[A-Z]+\d+$/,
};

export const CACHE_KEYS = {
  ROUTINE_DATA: 'routineData',
  TEACHERS: 'teachers',
  LABS: 'labs',
  COMMITTEE: 'committee',
};

export const STORAGE_KEYS = {
  THEME: 'vu-routine-theme',
  SEMESTER: 'vu-routine-semester',
  SEARCH_QUERY: 'vu-routine-search',
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
};
