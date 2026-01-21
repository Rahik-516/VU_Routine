import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Monitor, FileText, Info, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Timetable', icon: Calendar },
  { path: '/teachers', label: 'Teachers', icon: Users },
  { path: '/labs', label: 'Labs', icon: Monitor },
  { path: '/committee', label: 'Routine Committee', icon: FileText },
  { path: '/about', label: 'About', icon: Info },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-br from-primary-600/10 to-purple-600/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
            <img src="/logo.png" alt="Department Logo" className="w-7 h-7 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white">
            VU Routine
          </h1>
        </div>
        <p className="text-xs text-gray-300">
          CSE Department
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:scale-[1.02] hover:shadow-md'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700/50 shadow-lg z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Department Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold text-white">
              VU Routine
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/70 z-40 pt-16" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="bg-gray-900 w-64 h-full flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </div>
        </div>
      )}  

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-900 border-r border-gray-700/50 shadow-xl z-40">
        <NavContent />
      </div>
    </>
  );
};
