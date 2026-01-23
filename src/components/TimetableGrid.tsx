import React from 'react';
import type { ClassSession, TimeSlot } from '@/types/index';
import { getCourseColor, formatTime } from '@/utils/helpers';
import { isCurrentSlot } from '@/hooks/useCurrentTimeSlot';

interface TimetableGridProps {
  schedule: { day: string; classes: ClassSession[] }[];
  timeSlots: TimeSlot[];
  filterSection?: string;
}

export const TimetableGrid: React.FC<TimetableGridProps> = React.memo(({ schedule, timeSlots, filterSection }) => {
  const getClassForSlot = (day: string, slotNumber: number) => {
    const daySchedule = schedule.find((s) => s.day === day);
    return daySchedule?.classes.find((c) => c.timeSlot === slotNumber);
  };

  return (
    <>
      {/* Desktop/Tablet View - Grid Layout */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-3">
            <div className="font-semibold text-sm text-gray-300 p-4 rounded-xl bg-gray-800/90 border border-gray-700/50">
              Day / Time
            </div>
            {timeSlots.map((slot) => (
              <div
                key={slot.slot}
                className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-xl p-4 text-center shadow-md"
              >
                <div className="font-semibold text-sm text-gray-100">
                  Slot {slot.slot}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
              </div>
            ))}
          </div>

          {/* Timetable Rows */}
          {schedule.map((daySchedule) => (
            <div
              key={daySchedule.day}
              className="grid grid-cols-[120px_repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-3"
            >
              {/* Day Label */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4 flex items-center justify-center font-semibold text-gray-100 shadow-lg">
                {daySchedule.day}
              </div>

              {/* Time Slots */}
              {timeSlots.map((slot) => {
                const classSession = getClassForSlot(daySchedule.day, slot.slot);
                const isCurrent = classSession
                  ? isCurrentSlot(classSession.day, classSession.startTime, classSession.endTime)
                  : false;

                if (!classSession) {
                  return (
                    <div
                      key={slot.slot}
                      className="bg-gray-800/80 rounded-xl p-4 border border-gray-700/30 min-h-[100px] flex items-center justify-center hover:border-gray-600/50 transition-all"
                    >
                      <span className="text-xs text-gray-500">No Class</span>
                    </div>
                  );
                }

                const colorClass = getCourseColor(classSession.courseCode);

                return (
                  <div
                    key={slot.slot}
                    className={`
                      ${colorClass}
                      rounded-xl p-4 border-2 min-h-[100px]
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                      cursor-pointer group relative
                      ${isCurrent ? 'ring-4 ring-green-400 ring-offset-2 ring-offset-gray-900 shadow-xl shadow-green-500/30' : 'shadow-md'}
                    `}
                    title={`${classSession.courseCode} - ${classSession.teacherName || classSession.teacherInitials}`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse shadow-lg">
                        NOW
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 h-full">
                      <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {classSession.courseName || classSession.courseCode}
                      </div>
                      
                      {classSession.courseName && classSession.courseName !== classSession.courseCode && (
                        <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                          {classSession.courseCode}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {classSession.teacherInitials}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {classSession.room}
                      </div>

                      {classSession.section && (
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Section: {classSession.section}
                        </div>
                      )}
                    </div>

                    {/* Hover Tooltip */}
                    {classSession.teacherName && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        <div className="font-semibold">{classSession.teacherName}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Vertical Day Cards */}
      <div className="md:hidden space-y-4">
        {schedule.map((daySchedule) => {
          // Count non-empty slots for this day
          const sessionCount = daySchedule.classes.length;
          const hasClasses = sessionCount > 0;

          // Filter to only show slots with classes in mobile view
          const nonEmptySlots = timeSlots.filter(
            (slot) => daySchedule.classes.some((c) => c.timeSlot === slot.slot)
          );

          return (
            <div key={daySchedule.day} className="bg-gray-800/90 rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
              {/* Day Header with Session Count */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-4 py-4 flex items-center justify-between shadow-md">
                <h3 className="font-bold text-base text-white">{daySchedule.day}</h3>
                {hasClasses && filterSection && (
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                    {sessionCount} {sessionCount === 1 ? 'class' : 'classes'}
                  </span>
                )}
              </div>
              
              {/* Classes for the Day */}
              {hasClasses ? (
                <div className="divide-y divide-gray-700/30">
                  {nonEmptySlots.map((slot) => {
                    const classSession = daySchedule.classes.find((c) => c.timeSlot === slot.slot);
                    const isCurrent = classSession
                      ? isCurrentSlot(classSession.day, classSession.startTime, classSession.endTime)
                      : false;

                    if (!classSession) return null;

                    return (
                      <div key={slot.slot} className="p-4 hover:bg-gray-700/20 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="min-w-[75px] bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
                            <div className="text-xs font-bold text-primary-400">
                              Slot {slot.slot}
                            </div>
                            <div className="text-xs text-gray-300 mt-1">
                              {formatTime(slot.startTime)}
                            </div>
                            <div className="text-xs text-gray-300">
                              {formatTime(slot.endTime)}
                            </div>
                          </div>
                          
                          <div className={`flex-1 p-4 rounded-xl ${getCourseColor(classSession.courseCode)} border-2 relative shadow-lg ${isCurrent ? 'ring-2 ring-green-400 shadow-green-500/30' : ''}`}>
                            {isCurrent && (
                              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse shadow-lg">
                                NOW
                              </div>
                            )}
                            
                            <div className="font-bold text-base text-gray-900 dark:text-gray-100 mb-2">
                              {classSession.courseName || classSession.courseCode}
                            </div>
                            
                            {classSession.courseName && classSession.courseName !== classSession.courseCode && (
                              <div className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-2">
                                {classSession.courseCode}
                              </div>
                            )}
                            
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{classSession.teacherName || classSession.teacherInitials}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{classSession.room}</span>
                              </div>

                              {classSession.section && (
                                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                  Section: {classSession.section}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No classes scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
});
