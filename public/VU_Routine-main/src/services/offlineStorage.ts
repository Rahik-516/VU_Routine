import type { RoutineData } from '@/types/index';

const STORAGE_KEY = 'vu-routine-offline-data';
const SYNC_STATUS_KEY = 'vu-routine-sync-status';

/**
 * Offline storage service using IndexedDB and localStorage
 * Provides fallback access to the last successfully loaded timetable
 */

interface SyncStatus {
  lastSyncTime: number;
  isOnline: boolean;
}

/**
 * Save routine data to localStorage for offline access
 * This persists the last successfully fetched data
 */
export function saveOfflineData(data: RoutineData): void {
  try {
    const serialized = JSON.stringify({
      ...data,
      lastUpdated: data.lastUpdated.toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
    updateSyncStatus();
    console.log('✅ Offline data saved to localStorage');
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
}

/**
 * Load routine data from localStorage (offline fallback)
 * Returns null if no data exists
 */
export function getOfflineData(): RoutineData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Convert ISO string back to Date
    if (parsed.lastUpdated) {
      parsed.lastUpdated = new Date(parsed.lastUpdated);
    }
    console.log('✅ Loaded offline data from localStorage');
    return parsed as RoutineData;
  } catch (error) {
    console.error('Failed to load offline data:', error);
    return null;
  }
}

/**
 * Clear offline data
 */
export function clearOfflineData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Offline data cleared');
  } catch (error) {
    console.error('Failed to clear offline data:', error);
  }
}

/**
 * Update sync status with current timestamp and online status
 */
function updateSyncStatus(): void {
  const status: SyncStatus = {
    lastSyncTime: Date.now(),
    isOnline: navigator.onLine,
  };
  try {
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Failed to update sync status:', error);
  }
}

/**
 * Get sync status info
 */
export function getSyncStatus(): SyncStatus | null {
  try {
    const stored = localStorage.getItem(SYNC_STATUS_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SyncStatus;
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return null;
  }
}

/**
 * Check if offline data exists and is available
 */
export function hasOfflineData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Get timestamp of last offline data save (for display purposes)
 */
export function getOfflineDataTimestamp(): Date | null {
  const status = getSyncStatus();
  if (!status || !status.lastSyncTime) return null;
  return new Date(status.lastSyncTime);
}
