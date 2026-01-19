import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, RefreshCw } from 'lucide-react';

interface LastUpdatedProps {
  lastUpdated: Date;
  isRefetching?: boolean;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({ lastUpdated, isRefetching }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      {isRefetching ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Updating...</span>
        </>
      ) : (
        <>
          <Clock className="w-4 h-4" />
          <span>
            Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
        </>
      )}
    </div>
  );
};
