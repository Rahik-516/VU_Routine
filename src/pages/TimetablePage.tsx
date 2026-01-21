import React, { useMemo } from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { useAppStore } from '@/store';
import { Calendar } from 'lucide-react';
import { TimetableGrid } from '@/components/TimetableGrid';
import { SemesterSelector } from '@/components/SemesterSelector';
import { SectionSelector } from '@/components/SectionSelector';
import { SearchBar } from '@/components/SearchBar';
import { TimetableSkeleton } from '@/components/TimetableSkeleton';
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
  if (isLoading && !data) {
    return <TimetableSkeleton />;
  }

  if (error && !data) {
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
      <div className="bg-gradient-to-r from-primary-600/10 to-purple-600/10 border border-primary-500/20 rounded-2xl p-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Class Routine - {currentSemester} Semester
          {filterSection && (
            <span className="text-primary-400"> - Section {filterSection}</span>
          )}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
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
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 min-h-[44px] shadow-md ${
          currentDayOnly
            ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02]'
            : 'bg-gray-800/90 text-gray-200 border border-gray-700/50 hover:bg-gray-800 hover:scale-[1.02]'
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
            <div className="text-center py-8 sm:py-12 bg-gray-800/90 rounded-2xl shadow-lg border border-gray-700/50">
              <p className="text-gray-300 text-base sm:text-lg px-4">
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
            <div className="bg-gray-800/90 rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-700/50">
              <TimetableGrid
                schedule={filteredSchedule}
                timeSlots={semesterData.timeSlots}
                filterSection={filterSection}
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
