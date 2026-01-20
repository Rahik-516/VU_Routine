import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchRoutineData } from '@/services/googleSheets';
import { subscribeSyncStatus } from '@/services/autoSync';

const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useRoutineData() {
  const query = useQuery({
    queryKey: ['routineData'],
    queryFn: fetchRoutineData,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
  });

  // Subscribe to online/offline events for auto-sync
  useEffect(() => {
    const unsubscribe = subscribeSyncStatus({
      onOnline: () => {
        // When connectivity is restored, refetch data immediately
        query.refetch();
      },
      onOffline: () => {
        // When offline, just log it - the query will use cached/fallback data
        console.log('📡 Using cached data while offline');
      },
    });

    return unsubscribe;
  }, [query]);

  return query;
}
