import React from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { LabCards } from '@/components/LabCards';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export const LabsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useRoutineData();

  if (isLoading) {
    return <LoadingSpinner message="Loading lab information..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load lab data."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.labs.length === 0) {
    return <ErrorMessage message="No lab information available" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Computer Labs
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          CSE Department Laboratory Facilities
        </p>
      </div>

      <LabCards labs={data.labs} />
    </div>
  );
};
