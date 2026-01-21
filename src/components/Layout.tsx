import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      
      <main className="lg:pl-64 pt-16 lg:pt-0 flex-1 relative z-10">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};
