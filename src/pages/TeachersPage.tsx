import React, { useMemo, useState } from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { TeacherDirectory } from '@/components/TeacherDirectory';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export const TeachersPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useRoutineData();
  const [search, setSearch] = useState('');

  const filteredTeachers = useMemo(() => {
    if (!data || data.teachers.length === 0) {
      return [];
    }

    const term = search.trim().toLowerCase();

    return data.teachers
      .filter((t) => t.name && t.initial) // ensure required fields
      .filter((t) => {
        // Exclude header/metadata-like rows
        const initial = t.initial.toLowerCase();
        const name = t.name.toLowerCase();
        const looksHeader = initial.includes('initial') && name.includes('name');
        if (looksHeader) return false;

        if (!term) return true;
        return name.includes(term) || initial.includes(term);
      });
  }, [data, search]);

  if (isLoading) {
    return <LoadingSpinner message="Loading teachers..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load teacher data."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.teachers.length === 0) {
    return <ErrorMessage message="No teacher data available" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Faculty Directory
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          CSE Department Teaching Staff
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="teacher-search">
          Search by teacher name
        </label>
        <input
          id="teacher-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or initial"
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] text-base touch-manipulation"
        />
      </div>

      <TeacherDirectory teachers={filteredTeachers} />
    </div>
  );
};
