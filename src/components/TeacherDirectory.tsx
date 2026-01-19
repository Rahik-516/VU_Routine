import React from 'react';
import type { Teacher } from '@/types/index';
import { Mail, User } from 'lucide-react';

interface TeacherDirectoryProps {
  teachers: Teacher[];
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({ teachers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => {
        const telHref = teacher.contact?.replace(/\s+/g, '');
        const showDepartment = !!teacher.department;

        return (
        <div
          key={teacher.initial}
          className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-5 border border-primary-200 dark:border-primary-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2.5 flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                {teacher.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Initial: <span className="font-mono font-semibold">{teacher.initial}</span>
              </p>
              {teacher.designation && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {teacher.designation}
                </p>
              )}
              {showDepartment && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Dept. of {teacher.department}
                </p>
              )}
              {teacher.university && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {teacher.university}
                </p>
              )}
              {teacher.contact && telHref && (
                <a
                  href={`tel:${telHref}`}
                  className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-flex min-h-[44px] items-center touch-manipulation"
                >
                  Contact: <span className="font-mono ml-1">{teacher.contact}</span>
                </a>
              )}
              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 min-h-[44px] touch-manipulation"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="break-all">{teacher.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};
