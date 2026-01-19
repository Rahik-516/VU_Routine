import React from 'react';
import { BookOpen, Calendar, Users, Monitor, Info } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          About This Application
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Class Routine Viewer for Varendra University
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-8 border border-primary-200 dark:border-primary-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          CSE Department - Spring 2026
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          This modern web application provides real-time access to class schedules for the
          Computer Science and Engineering department at Varendra University. The routine
          data is automatically synced from our official Google Spreadsheet, ensuring
          you always have the latest information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Auto-Updating Schedule
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Timetables are automatically refreshed every 5 minutes to ensure you have
            the most current information.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Teacher Directory
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Access complete information about faculty members including their contact
            details and designations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
              <Monitor className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Lab Information
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View details about computer labs, their locations, capacity, and available
            equipment.
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              All Semesters
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Access routines for all semesters (1st through 9th) in one convenient
            location.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Features
          </h3>
        </div>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>View Class Routines:</strong> Browse timetables for all 9 semesters with current class highlighted in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Today's Schedule:</strong> Quickly filter to view only today's classes with one click</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Next Class Widget:</strong> See your next scheduled class with automatic updates every minute based on current time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Search & Filter:</strong> Find courses, teachers, and rooms; filter by semester and section</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Faculty Directory:</strong> Access teacher details with direct phone call and email options</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Lab Information:</strong> View computer lab locations, in-charge staff, and contact information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Routine Committee:</strong> Find committee members managing the academic schedule</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Dark Mode:</strong> Easy on the eyes with full dark theme support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Mobile Optimized:</strong> Fully responsive design works perfectly on phones, tablets, and desktops</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
            <span><strong>Live Data Sync:</strong> Automatically syncs with Google Sheets for always up-to-date information</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Data Source
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          All routine information is synced from the official Google Spreadsheet
          maintained by the department. Any changes made to the spreadsheet will
          automatically appear in this application within 5 minutes.
        </p>
      </div>
    </div>
  );
};
