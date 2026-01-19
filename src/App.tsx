import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { TimetablePage } from '@/pages/TimetablePage';
import { TeachersPage } from '@/pages/TeachersPage';
import { LabsPage } from '@/pages/LabsPage';
import { CommitteePage } from '@/pages/CommitteePage';
import { AboutPage } from '@/pages/AboutPage';
import { useAppStore } from '@/store';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const { isDarkMode } = useAppStore();

  // Initialize theme on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TimetablePage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="labs" element={<LabsPage />} />
            <Route path="committee" element={<CommitteePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
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
        backgroundColor: '#ffffff',
        color: '#111827',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Loading application...
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}

export default App;
