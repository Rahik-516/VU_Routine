import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show when online
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 shadow-lg flex items-center gap-3">
        <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            You're offline
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
            Using cached data. Changes will sync when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
};
