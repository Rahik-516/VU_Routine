import React, { useState, useEffect } from 'react';
import type { ClassSession } from '@/types/index';
import { getNextClass, formatTime } from '@/utils/helpers';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { useAppStore } from '@/store';

interface NextClassWidgetProps {
  classes: ClassSession[];
}

export const NextClassWidget: React.FC<NextClassWidgetProps> = ({ classes }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { filterSection } = useAppStore();

  // Auto-update every minute to show latest next class
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(timer);
  }, []);

  // Filter classes based on selected section
  const filteredClasses = classes.filter((c) => {
    if (!filterSection) return true; // Show all if no section selected
    return c.section === filterSection;
  });

  const nextClass = getNextClass(filteredClasses);
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (!nextClass) {
    const noClassMessage = filterSection 
      ? `No more classes scheduled for Section ${filterSection} today`
      : 'No more classes scheduled for today';
    
    return (
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Next Class
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {dayName}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {noClassMessage}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateStr} at {timeStr}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 sm:p-5 border border-green-200 dark:border-green-700 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
            Next Class
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2.5 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>{dayName}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
            {nextClass.courseCode}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2.5 py-1 rounded-full">
            {nextClass.section}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span className="font-semibold">
            {formatTime(nextClass.startTime)} - {formatTime(nextClass.endTime)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="truncate">{nextClass.teacherName || nextClass.teacherInitials}</span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span>{nextClass.room}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Current: {dateStr} at {timeStr}
          </p>
        </div>
      </div>
    </div>
  );
};
