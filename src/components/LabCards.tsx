import React from 'react';
import type { Lab } from '@/types/index';
import { MapPin, User, Phone } from 'lucide-react';

interface LabCardsProps {
  labs: Lab[];
}

export const LabCards: React.FC<LabCardsProps> = React.memo(({ labs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {labs.map((lab, index) => {
        const telHref = lab.contact?.replace(/\s+/g, '');
        const displayName = lab.shortName || lab.fullName || `Lab ${index + 1}`;
        
        return (
          <div
            key={`${lab.shortName || 'lab'}-${index}`}
            className="bg-gray-800/90 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-primary-500/50 hover:shadow-lg transition-all duration-200"
          >
            <h3 className="font-bold text-base sm:text-lg text-gray-100 mb-3 break-words">
              {displayName}
            </h3>
            
            {lab.fullName && lab.shortName !== lab.fullName && (
              <p className="text-xs sm:text-sm text-gray-400 mb-3">
                {lab.fullName}
              </p>
            )}

            {lab.room && (
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span className="text-xs sm:text-sm">Room: {lab.room}</span>
              </div>
            )}

            {lab.inCharge && (
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <User className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span className="text-xs sm:text-sm">In-charge: {lab.inCharge}</span>
              </div>
            )}

            {lab.contact && telHref && (
              <a
                href={`tel:${telHref}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-xs sm:text-sm text-green-400 hover:text-green-300 transition-all hover:shadow-lg hover:shadow-green-500/20 min-h-[44px] touch-manipulation group w-fit"
              >
                <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono">{lab.contact}</span>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
});
