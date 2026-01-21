import React from 'react';
import type { ClassSession, TimeSlot } from '@/types/index';
import { getCourseColor, formatTime } from '@/utils/helpers';
import { isCurrentSlot } from '@/hooks/useCurrentTimeSlot';

interface TimetableGridProps {
  schedule: { day: string; classes: ClassSession[] }[];
  timeSlots: TimeSlot[];
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ schedule, timeSlots }) => {
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
          <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(150px,1fr))] gap-2 mb-2">
            <div className="font-semibold text-sm text-gray-700 dark:text-gray-300 p-3">
              Day / Time
            </div>
            {timeSlots.map((slot) => (
              <div
                key={slot.slot}
                className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center"
              >
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Slot {slot.slot}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
              </div>
            ))}
          </div>

          {/* Timetable Rows */}
          {schedule.map((daySchedule) => (
            <div
              key={daySchedule.day}
              className="grid grid-cols-[120px_repeat(auto-fit,minmax(150px,1fr))] gap-2 mb-2"
            >
              {/* Day Label */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-center font-semibold text-gray-900 dark:text-gray-100">
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
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 min-h-[100px] flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-400 dark:text-gray-600">No Class</span>
                    </div>
                  );
                }

                const colorClass = getCourseColor(classSession.courseCode);

                return (
                  <div
                    key={slot.slot}
                    className={`
                      ${colorClass}
                      rounded-lg p-3 border-2 min-h-[100px]
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      cursor-pointer group relative
                      ${isCurrent ? 'ring-4 ring-green-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
                    `}
                    title={`${classSession.courseCode} - ${classSession.teacherName || classSession.teacherInitials}`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                        NOW
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 h-full">
                      <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {classSession.courseCode}
                      </div>
                      
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
        {schedule.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Day Header */}
            <div className="bg-primary-600 dark:bg-primary-700 px-4 py-3">
              <h3 className="font-bold text-base text-white">{daySchedule.day}</h3>
            </div>
            
            {/* Classes for the Day */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {timeSlots.map((slot) => {
                const classSession = getClassForSlot(daySchedule.day, slot.slot);
                const isCurrent = classSession
                  ? isCurrentSlot(classSession.day, classSession.startTime, classSession.endTime)
                  : false;
                
                return (
                  <div key={slot.slot} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-[70px]">
                        <div className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          Slot {slot.slot}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {formatTime(slot.startTime)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {formatTime(slot.endTime)}
                        </div>
                      </div>
                      
                      {classSession ? (
                        <div className={`flex-1 p-3 rounded-lg ${getCourseColor(classSession.courseCode)} border-2 relative ${isCurrent ? 'ring-2 ring-green-500' : ''}`}>
                          {isCurrent && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              NOW
                            </div>
                          )}
                          
                          <div className="font-bold text-base text-gray-900 dark:text-gray-100 mb-2">
                            {classSession.courseCode}
                          </div>
                          
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
                      ) : (
                        <div className="flex-1 text-center py-4 text-gray-400 dark:text-gray-600 text-sm italic border border-gray-200 dark:border-gray-700 rounded-lg">
                          No class
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
