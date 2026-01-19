import { useQuery } from '@tanstack/react-query';
import { fetchRoutineData } from '@/services/googleSheets';

const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useRoutineData() {
  return useQuery({
    queryKey: ['routineData'],
    queryFn: fetchRoutineData,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
  });
}
