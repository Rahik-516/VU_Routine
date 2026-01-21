import React from 'react';
import type { Teacher } from '@/types/index';
import { Mail, User, Phone } from 'lucide-react';

interface TeacherDirectoryProps {
  teachers: Teacher[];
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = React.memo(({ teachers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => {
        const telHref = teacher.contact?.replace(/\s+/g, '');
        const showDepartment = !!teacher.department;

        return (
        <div
          key={teacher.initial}
          className="bg-gray-800/90 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-primary-500/50 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-full p-3 flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-100 break-words">
                {teacher.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Initial: <span className="font-mono font-semibold text-primary-400">{teacher.initial}</span>
              </p>
              {teacher.designation && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {teacher.designation}
                </p>
              )}
              {showDepartment && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Dept. of {teacher.department}
                </p>
              )}
              {teacher.university && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {teacher.university}
                </p>
              )}
              <div className="mt-3 space-y-2">
                {teacher.contact && telHref && (
                  <a
                    href={`tel:${telHref}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-xs sm:text-sm text-green-400 hover:text-green-300 transition-all hover:shadow-lg hover:shadow-green-500/20 min-h-[44px] touch-manipulation group"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono break-all">{teacher.contact}</span>
                  </a>
                )}
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-all hover:shadow-lg hover:shadow-blue-500/20 min-h-[44px] touch-manipulation group"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="break-all">{teacher.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
});
