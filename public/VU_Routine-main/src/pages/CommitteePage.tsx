import React from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { CommitteeCard } from '@/components/CommitteeCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export const CommitteePage: React.FC = () => {
  const { data, isLoading, error, refetch } = useRoutineData();

  if (isLoading) {
    return <LoadingSpinner message="Loading committee information..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load committee data."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.committee.length === 0) {
    return <ErrorMessage message="No committee information available" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Routine Committee
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Members responsible for managing the class routine
        </p>
      </div>

      <CommitteeCard committee={data.committee} />
    </div>
  );
};
