# VU Routine - Class Timetable Viewer

A modern, real-time class routine viewer for the CSE Department at Varendra University (Spring 2026).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)

## 🌟 Features

- **📅 Auto-Updating Timetables** - Automatically syncs with Google Sheets every 5 minutes
- **🎨 Modern UI** - Beautiful, responsive design with Tailwind CSS
- **🌓 Dark Mode** - Full dark mode support with theme persistence
- **🔍 Smart Search** - Search by course code, teacher, or room
- **⏰ Real-Time Highlighting** - Current class and time slot automatically highlighted
- **📱 Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **👨‍🏫 Teacher Directory** - Complete faculty information with contact details
- **🧪 Lab Information** - Details about computer lab facilities
- **🎯 Next Class Widget** - See your upcoming class at a glance
- **🎨 Color-Coded Classes** - Easy visual identification of different courses

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Google Sheets API key (optional, can use CSV export method)

### Installation

1. **Clone or use this existing project**

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Configure Google Sheets access**:

   Open `src/services/googleSheets.ts` and either:
   
   - **Option A (Recommended for public sheets)**: Use CSV export (no API key needed)
     ```typescript
     const USE_CSV_EXPORT = true; // Already set to true
     ```
   
   - **Option B**: Use Google Sheets API v4
     - Get an API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     - Replace `YOUR_GOOGLE_SHEETS_API_KEY` with your actual API key
     - Set `USE_CSV_EXPORT = false`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to the URL shown in terminal (typically http://localhost:5173)

## 📁 Project Structure

```
vu_routine/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── TimetableGrid.tsx
│   │   ├── SemesterSelector.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TeacherDirectory.tsx
│   │   ├── LabCards.tsx
│   │   ├── CommitteeCard.tsx
│   │   ├── NextClassWidget.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── TimetablePage.tsx
│   │   ├── TeachersPage.tsx
│   │   ├── LabsPage.tsx
│   │   ├── CommitteePage.tsx
│   │   └── AboutPage.tsx
│   │
│   ├── services/           # Data fetching & API
│   │   └── googleSheets.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useRoutineData.ts
│   │   ├── useFilteredClasses.ts
│   │   └── useCurrentTimeSlot.ts
│   │
│   ├── store/              # Zustand state management
│   │   └── index.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Helper functions
│   │   └── helpers.ts
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🔧 Configuration

### Google Sheets Setup

The application expects a Google Spreadsheet with this structure:

**Main Sheet (Sheet1)**:
- Teacher list (Initials, Full Name, Designation, Email)
- Lab information (Name, Location, Capacity)
- Routine committee (Name, Role)

**Semester Sheets**: Named "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"
- Each contains timetable with days as rows and time slots as columns
- Format: `CourseCode - TeacherInitials - Room - Section`

### Customization

**Change refresh interval** (default 5 minutes):
```typescript
// src/hooks/useRoutineData.ts
const REFETCH_INTERVAL = 5 * 60 * 1000; // Change this value
```

**Modify time slots**:
```typescript
// src/types/index.ts
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { slot: 1, startTime: '09:00', endTime: '10:00' },
  // Add or modify slots here
];
```

**Update course colors**:
```typescript
// src/utils/helpers.ts
const COURSE_COLORS = [
  // Modify or add color classes
];
```

## 🎨 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Navigation
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible components
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **Axios** - HTTP client

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### GitHub Pages
```bash
# Add to vite.config.ts:
base: '/repo-name/',

npm run build
# Deploy 'dist' folder
```

## 🐛 Troubleshooting

**Problem**: Data not loading
- **Solution**: Check internet connection and Google Sheets URL
- Verify the spreadsheet is publicly accessible
- Check browser console for errors

**Problem**: API key errors
- **Solution**: Switch to CSV export method (`USE_CSV_EXPORT = true`)

**Problem**: Dark mode not persisting
- **Solution**: Clear browser cache and localStorage

## 📄 License

MIT License - feel free to use this project for your institution!

## 🙏 Acknowledgments

- Varendra University CSE Department
- All contributors and maintainers

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for Varendra University
