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
            min-h-[44px] touch-manipulation
            ${
              currentSemester === semester
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
            }
          `}
        >
          <span className="hidden sm:inline">{semester} Semester</span>
          <span className="sm:hidden">{semester}</span>
        </button>
      ))}
    </div>
  );
};
