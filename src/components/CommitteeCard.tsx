import React from 'react';
import type { CommitteeMember } from '@/types/index';
import { Users, Phone } from 'lucide-react';

interface CommitteeCardProps {
  committee: CommitteeMember[];
}

export const CommitteeCard: React.FC<CommitteeCardProps> = React.memo(({ committee }) => {
  return (
    <div className="bg-gray-800/90 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-100">
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
              className="flex items-center justify-between gap-3 p-4 sm:p-5 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl border border-gray-700/50 hover:border-primary-500/50 transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-gray-100 break-words">
                  {displayName}
                </h3>
                {member.initial && (
                  <p className="text-xs sm:text-sm text-gray-400">
                    Initial: <span className="font-mono font-semibold text-primary-400">{member.initial}</span>
                  </p>
                )}
              </div>
              {member.contact && telHref && (
                <a
                  href={`tel:${telHref}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-xs sm:text-sm text-green-400 hover:text-green-300 transition-all hover:shadow-lg hover:shadow-green-500/20 min-h-[44px] touch-manipulation whitespace-nowrap group flex-shrink-0"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono">{member.contact}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
