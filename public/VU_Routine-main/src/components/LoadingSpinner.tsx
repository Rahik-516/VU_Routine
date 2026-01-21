import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary-600 dark:text-primary-400" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};
