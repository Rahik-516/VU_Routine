// Type definitions for the application

export interface Teacher {
  initial: string;
  name: string;
  designation: string;
  department: string;
  university: string;
  contact: string | null;
  email: string | null;
}

export interface Lab {
  shortName: string;
  fullName: string;
  room: string | null;
  inCharge: string | null;
  contact: string | null;
}

export interface CommitteeMember {
  initial: string;
  name: string;
  contact: string | null;
}

export interface TimeSlot {
  slot: number;
  startTime: string;
  endTime: string;
}

export interface ClassSession {
  courseCode: string;
  courseName?: string;
  teacherInitials: string;
  teacherName?: string;
  room: string;
  section?: string;
  type?: 'Lecture' | 'Lab' | 'Tutorial';
  day: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  day: string;
  classes: ClassSession[];
}

export interface SemesterTimetable {
  semester: string;
  schedule: DaySchedule[];
  timeSlots: TimeSlot[];
}

export interface RoutineData {
  teachers: Teacher[];
  labs: Lab[];
  committee: CommitteeMember[];
  semesters: {
    [key: string]: SemesterTimetable;
  };
  lastUpdated: Date;
}

export type Semester = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th' | '9th';

export const SEMESTERS: Semester[] = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { slot: 1, startTime: '09:00', endTime: '10:30' },
  { slot: 2, startTime: '10:30', endTime: '12:00' },
  { slot: 3, startTime: '12:00', endTime: '13:30' },
  { slot: 4, startTime: '14:00', endTime: '15:30' },
  { slot: 5, startTime: '15:30', endTime: '17:00' },
];
