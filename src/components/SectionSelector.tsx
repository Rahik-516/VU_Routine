import React, { useMemo } from 'react';
import { useAppStore } from '@/store';
import { useRoutineData } from '@/hooks/useRoutineData';

export const SectionSelector: React.FC = () => {
  const { filterSection, setFilterSection, currentSemester } = useAppStore();
  const { data } = useRoutineData();

  // Extract unique sections from current semester data
  const availableSections = useMemo(() => {
    if (!data || !data.semesters[currentSemester]) return [];

    const semesterData = data.semesters[currentSemester];
    const allClasses = semesterData.schedule.flatMap((day) => day.classes);
    const sections = new Set(
      allClasses
        .map((c) => c.section)
        .filter((s): s is string => !!s)
    );

    return Array.from(sections).sort();
  }, [data, currentSemester]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by Section
      </label>
      {availableSections.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          No sections available for {currentSemester} semester
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSection('')}
            className={`
              px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm transition-all duration-200
              min-h-[44px] touch-manipulation relative
              ${filterSection === ''
                ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-400/30 scale-105 ring-2 ring-primary-300 ring-offset-2 ring-offset-gray-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.02] active:scale-95'
              }
            `}
          >
            {filterSection === '' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
            )}
            <span className="hidden sm:inline">All Sections</span>
            <span className="sm:hidden">All</span>
          </button>
          {availableSections.map((section) => (
            <button
              key={section}
              onClick={() => setFilterSection(section)}
              className={`
                px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                min-h-[44px] touch-manipulation relative
                ${filterSection === section
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-400/30 scale-105 ring-2 ring-primary-300 ring-offset-2 ring-offset-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.02] active:scale-95'
                }
              `}
            >
              {filterSection === section && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
              )}
              <span className="hidden sm:inline">Section {section}</span>
              <span className="sm:hidden">{section}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
