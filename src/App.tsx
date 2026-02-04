import { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Layout } from '@/components/Layout';
import { TimetablePage } from '@/pages/TimetablePage';
const TeachersPage = lazy(() => import('@/pages/TeachersPage').then(m => ({ default: m.TeachersPage })));
const LabsPage = lazy(() => import('@/pages/LabsPage').then(m => ({ default: m.LabsPage })));
const CommitteePage = lazy(() => import('@/pages/CommitteePage').then(m => ({ default: m.CommitteePage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
import { initializeAutoSync, cleanupAutoSync } from '@/services/autoSync';
import { fetchRoutineData } from '@/services/googleSheets';

// Create a client with optimized settings for faster initial load
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus (saves network calls)
      retry: 1, // Reduce retries to speed up failures
      staleTime: 10 * 60 * 1000, // 10 minutes (less frequent refetches)
      gcTime: 15 * 60 * 1000, // 15 minutes (keep cached data longer)
    },
  },
});

// Prefetch routine data immediately when app loads
queryClient.prefetchQuery({
  queryKey: ['routineData'],
  queryFn: fetchRoutineData,
});

function AppContent() {
  // Always apply dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Initialize auto-sync on mount
  useEffect(() => {
    initializeAutoSync();
    return () => cleanupAutoSync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TimetablePage />} />
            <Route path="teachers" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading teachers...</div>}>
                <TeachersPage />
              </Suspense>
            } />
            <Route path="labs" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading labs...</div>}>
                <LabsPage />
              </Suspense>
            } />
            <Route path="committee" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading committee...</div>}>
                <CommitteePage />
              </Suspense>
            } />
            <Route path="about" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading about...</div>}>
                <AboutPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: '#f9fafb',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Loading...
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}

export default App;
