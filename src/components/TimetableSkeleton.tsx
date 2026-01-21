import React from 'react';

export const TimetableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-primary-600/10 to-purple-600/10 border border-primary-500/20 rounded-2xl p-6">
        <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
      </div>

      {/* Controls Skeleton */}
      <div className="space-y-3">
        <div className="h-12 bg-gray-800/90 rounded-xl w-full"></div>
        <div className="h-12 bg-gray-800/90 rounded-xl w-full"></div>
        <div className="h-12 bg-gray-800/90 rounded-xl w-full"></div>
        <div className="h-12 bg-gray-800/90 rounded-xl w-48"></div>
      </div>

      {/* Timetable Grid Skeleton - Desktop */}
      <div className="hidden md:block bg-gray-800/90 rounded-2xl p-6 shadow-lg border border-gray-700/50">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/50 rounded-xl"></div>
            ))}
          </div>
          {/* Data Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-24 bg-gray-700/30 rounded-xl"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Cards Skeleton - Mobile */}
      <div className="md:hidden space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800/90 rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-4 py-4">
              <div className="h-6 bg-white/20 rounded w-24"></div>
            </div>
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-20 bg-gray-700/30 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
