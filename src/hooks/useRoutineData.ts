import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchRoutineData } from '@/services/googleSheets';
import { subscribeSyncStatus } from '@/services/autoSync';
import { getOfflineData } from '@/services/offlineStorage';

const REFETCH_INTERVAL = 10 * 60 * 1000; // 10 minutes (reduced from 5 for better performance)

export function useRoutineData() {
  const query = useQuery({
    queryKey: ['routineData'],
    queryFn: fetchRoutineData,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: false, // Disable to prevent unnecessary network calls
    // Use cached data immediately for instant load
    placeholderData: () => getOfflineData() || undefined,
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
