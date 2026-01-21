import React from 'react';
import type { CommitteeMember } from '@/types/index';
import { Users } from 'lucide-react';

interface CommitteeCardProps {
  committee: CommitteeMember[];
}

export const CommitteeCard: React.FC<CommitteeCardProps> = ({ committee }) => {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 border border-primary-200 dark:border-primary-700">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Routine Committee
        </h2>
      </div>
      
      <div className="space-y-3">
        {committee.map((member, index) => {
          const telHref = member.contact?.replace(/\s+/g, '');
          const displayName = member.name || member.initial || `Member ${index + 1}`;
          return (
            <div
              key={`${member.initial || 'member'}-${index}`}
              className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                  {displayName}
                </h3>
                {member.initial && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Initial: <span className="font-mono font-semibold">{member.initial}</span>
                  </p>
                )}
              </div>
              {member.contact && telHref && (
                <a
                  href={`tel:${telHref}`}
                  className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline min-h-[44px] flex items-center touch-manipulation whitespace-nowrap"
                >
                  {member.contact}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
