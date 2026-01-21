import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Semester } from '@/types/index';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Current selection
  currentSemester: Semester;
  setCurrentSemester: (semester: Semester) => void;
  
  // Search and filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  filterTeacher: string;
  setFilterTeacher: (teacher: string) => void;
  
  filterRoom: string;
  setFilterRoom: (room: string) => void;
  
  filterSection: string;
  setFilterSection: (section: string) => void;
  
  currentDayOnly: boolean;
  setCurrentDayOnly: (value: boolean) => void;
  
  // Clear all filters
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      isDarkMode: true,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        // Apply dark mode class to document immediately
        if (newMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('vu-routine-dark-mode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('vu-routine-dark-mode', 'false');
        }
        return { isDarkMode: newMode };
      }),
      
      // Current selection
      currentSemester: '1st',
      setCurrentSemester: (semester) => set({ 
        currentSemester: semester,
        filterSection: '', // Reset section when semester changes
      }),
      
      // Search and filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      filterTeacher: '',
      setFilterTeacher: (teacher) => set({ filterTeacher: teacher }),
      
      filterRoom: '',
      setFilterRoom: (room) => set({ filterRoom: room }),
      
      filterSection: '',
      setFilterSection: (section) => set({ filterSection: section }),
      
      currentDayOnly: false,
      setCurrentDayOnly: (value) => set({ currentDayOnly: value }),
      
      // Clear all filters
      clearFilters: () => set({
        searchQuery: '',
        filterTeacher: '',
        filterRoom: '',
        filterSection: '',
        currentDayOnly: false,
      }),
    }),
    {
      name: 'vu-routine-storage',
      onRehydrateStorage: () => (state) => {
        // Apply dark mode on initial load from localStorage
        const savedMode = localStorage.getItem('vu-routine-dark-mode');
        if (savedMode !== null) {
          const isDark = savedMode === 'true';
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          // Update state to match localStorage
          if (state && state.isDarkMode !== isDark) {
            state.isDarkMode = isDark;
          }
        } else if (state?.isDarkMode) {
          // Default to dark mode if no saved preference
          document.documentElement.classList.add('dark');
          localStorage.setItem('vu-routine-dark-mode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('vu-routine-dark-mode', 'false');
        }
      },
    }
  )
);
