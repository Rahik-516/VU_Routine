import { useMemo } from 'react';
import { format, parse } from 'date-fns';

export function useCurrentTimeSlot() {
  return useMemo(() => {
    const now = new Date();
    const currentDay = format(now, 'EEEE'); // Full day name
    const currentTime = format(now, 'HH:mm');

    return {
      day: currentDay,
      time: currentTime,
    };
  }, []);
}

export function isCurrentSlot(day: string, startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentDay = format(now, 'EEEE');
  
  if (currentDay !== day) return false;

  try {
    const start = parse(startTime, 'HH:mm', now);
    const end = parse(endTime, 'HH:mm', now);
    
    return now >= start && now <= end;
  } catch {
    return false;
  }
}
