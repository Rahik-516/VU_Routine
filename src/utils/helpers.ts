import type { ClassSession } from '@/types/index';

// Generate consistent colors for courses
const COURSE_COLORS = [
  'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
  'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700',
  'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
  'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700',
  'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700',
];

const courseColorMap = new Map<string, string>();

export function getCourseColor(courseCode: string): string {
  if (!courseColorMap.has(courseCode)) {
    const hash = courseCode.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const colorIndex = Math.abs(hash) % COURSE_COLORS.length;
    courseColorMap.set(courseCode, COURSE_COLORS[colorIndex]);
  }
  return courseColorMap.get(courseCode)!;
}

export function getNextClass(classes: ClassSession[]): ClassSession | null {
  if (!classes || classes.length === 0) return null;

  const now = new Date();
  // Get the current day name (Sunday-Thursday for CSE)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = now.getDay();
  const currentDay = dayNames[currentDayIndex];
  
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Filter classes for today that haven't started yet
  const upcomingTodayClasses = classes.filter((c) => {
    if (c.day !== currentDay) return false;

    const [hours, minutes] = c.startTime.split(':').map(Number);
    const classTime = hours * 60 + minutes;

    return classTime > currentTime;
  });

  // If there are upcoming classes today, return the earliest one
  if (upcomingTodayClasses.length > 0) {
    upcomingTodayClasses.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });
    return upcomingTodayClasses[0];
  }

  // If no classes today, look for the next day with classes
  const remainingDays = dayNames.slice(currentDayIndex + 1);
  for (const day of remainingDays) {
    const classesForDay = classes.filter((c) => c.day === day);
    if (classesForDay.length > 0) {
      // Return the first class of that day
      classesForDay.sort((a, b) => {
        const [aHours, aMinutes] = a.startTime.split(':').map(Number);
        const [bHours, bMinutes] = b.startTime.split(':').map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
      return classesForDay[0];
    }
  }

  return null;
}

export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}
