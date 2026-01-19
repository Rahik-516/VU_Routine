import React from 'react';
import type { Lab } from '@/types/index';
import { MapPin, User, Phone } from 'lucide-react';

interface LabCardsProps {
  labs: Lab[];
}

export const LabCards: React.FC<LabCardsProps> = ({ labs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {labs.map((lab, index) => {
        const telHref = lab.contact?.replace(/\s+/g, '');
        const displayName = lab.shortName || lab.fullName || `Lab ${index + 1}`;
        
        return (
          <div
            key={`${lab.shortName || 'lab'}-${index}`}
            className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-5 border border-primary-200 dark:border-primary-700 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 break-words">
              {displayName}
            </h3>
            
            {lab.fullName && lab.shortName !== lab.fullName && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                {lab.fullName}
              </p>
            )}

            {lab.room && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Room: {lab.room}</span>
              </div>
            )}

            {lab.inCharge && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">In-charge: {lab.inCharge}</span>
              </div>
            )}

            {lab.contact && telHref && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`tel:${telHref}`}
                  className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline min-h-[44px] flex items-center touch-manipulation"
                >
                  {lab.contact}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
