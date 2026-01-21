import React, { useMemo } from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { useAppStore } from '@/store';
import { Calendar } from 'lucide-react';
import { TimetableGrid } from '@/components/TimetableGrid';
import { SemesterSelector } from '@/components/SemesterSelector';
import { SectionSelector } from '@/components/SectionSelector';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LastUpdated } from '@/components/LastUpdated';
import { NextClassWidget } from '@/components/NextClassWidget';
import { enrichClassData } from '@/services/googleSheets';

export const TimetablePage: React.FC = () => {
  const { data, isLoading, error, refetch, isRefetching } = useRoutineData();
  const { currentSemester, filterSection, searchQuery, currentDayOnly, setCurrentDayOnly } = useAppStore();
  
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const todayName = days[today.getDay()];

  // Memoize enriched classes - must be called before early returns
  const semesterData = data?.semesters[currentSemester];
  
  const enrichedClasses = useMemo(() => {
    if (!data || !semesterData) return [];
    const allClasses = semesterData.schedule.flatMap((day) => day.classes) || [];
    return enrichClassData(allClasses, data.teachers);
  }, [data, semesterData]);

  // Memoize filtered and enriched schedule - must be called before early returns
  const filteredSchedule = useMemo(() => {
    if (!data || !semesterData) return [];

    const searchTerm = searchQuery.trim().toLowerCase();

    return semesterData.schedule
      .filter((day) => !currentDayOnly || day.day === todayName)
      .map((day) => ({
        ...day,
        classes: enrichClassData(day.classes, data.teachers).filter((c) => {
          // Apply section filter
          if (filterSection && c.section !== filterSection) return false;

          // Apply search filter
          if (searchTerm) {
            const courseMatch = c.courseCode.toLowerCase().includes(searchTerm);
            const teacherMatch = 
              (c.teacherName && c.teacherName.toLowerCase().includes(searchTerm)) ||
              (c.teacherInitials && c.teacherInitials.toLowerCase().includes(searchTerm));
            const roomMatch = c.room && c.room.toLowerCase().includes(searchTerm);

            return courseMatch || teacherMatch || roomMatch;
          }

          return true;
        }),
      }));
  }, [data, semesterData, filterSection, searchQuery, currentDayOnly, todayName]);

  const hasClasses = filteredSchedule.some((day) => day.classes.length > 0);

  // Early returns AFTER all hooks
  if (isLoading) {
    return <LoadingSpinner message="Loading timetable data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load timetable data. Please check your internet connection."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return <ErrorMessage message="No data available" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Class Routine - {currentSemester} Semester
          {filterSection && (
            <span className="text-primary-600 dark:text-primary-400"> - Section {filterSection}</span>
          )}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          CSE Department, Varendra University - Spring 2026
        </p>
      </div>

      {/* Last Updated */}
      {data.lastUpdated && (
        <LastUpdated lastUpdated={data.lastUpdated} isRefetching={isRefetching} />
      )}

      {/* Semester Selector */}
      <SemesterSelector />

      {/* Section Selector */}
      <SectionSelector />

      {/* Search Bar */}
      <SearchBar />

      {/* Today's Schedule Button */}
      <button
        onClick={() => setCurrentDayOnly(!currentDayOnly)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all min-h-[44px] ${
          currentDayOnly
            ? 'bg-primary-600 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>{currentDayOnly ? `Showing ${todayName} Only - Click to Show All Days` : "Show Today's Schedule"}</span>
      </button>

      {/* Next Class Widget */}
      <NextClassWidget classes={enrichedClasses} />

      {/* Timetable Grid */}
      {semesterData ? (
        <>
          {!hasClasses && (filterSection || searchQuery.trim()) ? (
            <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-4">
                No classes found {
                  filterSection && searchQuery.trim()
                    ? `in Section ${filterSection} matching "${searchQuery}"`
                    : searchQuery.trim()
                    ? `matching "${searchQuery}"`
                    : `in Section ${filterSection}`
                } in {currentSemester} semester
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm mt-2 px-4">
                {searchQuery.trim() && !filterSection && 'Try a different search term'}
                {filterSection && !searchQuery.trim() && 'Try selecting "All Sections" or a different section'}
                {filterSection && searchQuery.trim() && 'Try adjusting your filters or search term'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <TimetableGrid
                schedule={filteredSchedule}
                timeSlots={semesterData.timeSlots}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">
            No timetable available for {currentSemester} semester
          </p>
        </div>
      )}
    </div>
  );
};
