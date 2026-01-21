import { useMemo } from 'react';
import type { ClassSession } from '@/types/index';
import { useAppStore } from '@/store';

export function useFilteredClasses(classes: ClassSession[]) {
  const { searchQuery, filterTeacher, filterRoom, filterSection } = useAppStore();

  return useMemo(() => {
    let filtered = classes;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.courseCode.toLowerCase().includes(query) ||
          c.teacherInitials.toLowerCase().includes(query) ||
          c.teacherName?.toLowerCase().includes(query) ||
          c.room.toLowerCase().includes(query) ||
          c.section?.toLowerCase().includes(query)
      );
    }

    if (filterTeacher) {
      filtered = filtered.filter(
        (c) => c.teacherInitials.toLowerCase() === filterTeacher.toLowerCase()
      );
    }

    if (filterRoom) {
      filtered = filtered.filter(
        (c) => c.room.toLowerCase() === filterRoom.toLowerCase()
      );
    }

    if (filterSection) {
      filtered = filtered.filter(
        (c) => c.section?.toLowerCase() === filterSection.toLowerCase()
      );
    }

    return filtered;
  }, [classes, searchQuery, filterTeacher, filterRoom, filterSection]);
}
