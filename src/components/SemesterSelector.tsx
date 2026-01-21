import React from 'react';
import { SEMESTERS } from '@/types/index';
import { useAppStore } from '@/store';

export const SemesterSelector: React.FC = () => {
  const { currentSemester, setCurrentSemester } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2">
      {SEMESTERS.map((semester) => (
        <button
          key={semester}
          onClick={() => setCurrentSemester(semester)}
          className={`
            px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
            min-h-[44px] touch-manipulation relative
            ${
              currentSemester === semester
                ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-400/30 scale-105 ring-2 ring-primary-300 ring-offset-2 ring-offset-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02] active:scale-95'
            }
          `}
        >
          {currentSemester === semester && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
          )}
          <span className="hidden sm:inline">{semester} Semester</span>
          <span className="sm:hidden">{semester}</span>
        </button>
      ))}
    </div>
  );
};
