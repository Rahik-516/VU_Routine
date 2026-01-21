/**
 * Auto-sync service
 * Detects when connectivity is restored and triggers data refresh
 */

interface SyncListener {
  onOnline: () => void;
  onOffline: () => void;
}

const listeners: Set<SyncListener> = new Set();

/**
 * Initialize auto-sync detection
 * Should be called once during app startup (in App.tsx or main.tsx)
 */
export function initializeAutoSync(): void {
  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Log current status
  if (navigator.onLine) {
    console.log('🟢 Online');
  } else {
    console.log('🔴 Offline');
  }
}

/**
 * Clean up auto-sync listeners
 */
export function cleanupAutoSync(): void {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
}

/**
 * Register a listener for online/offline events
 */
export function subscribeSyncStatus(listener: SyncListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Handle when connectivity is restored
 */
function handleOnline(): void {
  console.log('🟢 Connectivity restored - triggering data sync...');
  listeners.forEach((listener) => {
    try {
      listener.onOnline();
    } catch (error) {
      console.error('Error in sync listener:', error);
    }
  });
}

/**
 * Handle when connectivity is lost
 */
function handleOffline(): void {
  console.log('🔴 Connectivity lost - will use cached data');
  listeners.forEach((listener) => {
    try {
      listener.onOffline();
    } catch (error) {
      console.error('Error in sync listener:', error);
    }
  });
}

/**
 * Check current online status
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
