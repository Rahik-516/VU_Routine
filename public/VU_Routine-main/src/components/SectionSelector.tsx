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
              px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm transition-all
              min-h-[44px] touch-manipulation
              ${filterSection === ''
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
              }
            `}
          >
            <span className="hidden sm:inline">All Sections</span>
            <span className="sm:hidden">All</span>
          </button>
          {availableSections.map((section) => (
            <button
              key={section}
              onClick={() => setFilterSection(section)}
              className={`
                px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm transition-all
                min-h-[44px] touch-manipulation
                ${filterSection === section
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                }
              `}
            >
              <span className="hidden sm:inline">Section {section}</span>
              <span className="sm:hidden">{section}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
