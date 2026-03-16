// // // import { TeacherAttendanceResponse } from '../types/teacherAttendance';
// // import type { TeacherAttendanceResponse } from '../types/teacherAttendance';
// // import { getDatesInRange } from './dateUtils';

// import type { TeacherAttendanceResponse } from "../types/teacherAttendance";
// import { getDatesInRange } from "./dateUtils";

// // export interface TeacherRow {
// //   id: number;
// //   teacherName: string;
// //   department?: string;
// //   [date: string]: any; // date -> leaveType or null
// // }

// // export const transformToCalendarData = (
// //   attendances: TeacherAttendanceResponse[],
// //   teachers: { id: number; name: string; department?: string }[],
// //   startDate: Date,
// //   endDate: Date
// // ): TeacherRow[] => {
// //   const dateRange = getDatesInRange(startDate, endDate);
// //   const rows: TeacherRow[] = teachers.map(t => ({
// //     id: t.id,
// //     teacherName: t.name,
// //     department: t.department,
// //   }));

// //   rows.forEach(row => {
// //     dateRange.forEach(date => {
// //       row[date] = null;
// //     });
// //   });

// //   attendances.forEach(att => {
// //     const row = rows.find(r => r.id === att.teacherId);
// //     if (row && dateRange.includes(att.date)) {
// //       row[att.date] = att.leaveType;
// //     }
// //   });

// //   return rows;
// // };


// // utils/transformAttendance.ts
// export interface TeacherRow {
//   id: number;
//   teacherName: string;
//   [date: string]: any;
// }

// export const transformToCalendarData = (
//   attendances: TeacherAttendanceResponse[],
//   teachers: { id: number; name: string }[],
//   startDate: Date,
//   endDate: Date
// ): TeacherRow[] => {
//   const dateRange = getDatesInRange(startDate, endDate);
//   const rows: TeacherRow[] = teachers.map(t => ({
//     id: t.id,
//     teacherName: t.name,
//   }));

//   rows.forEach(row => {
//     dateRange.forEach(date => {
//       row[date] = null;
//     });
//   });

//   attendances.forEach(att => {
//     const row = rows.find(r => r.id === att.teacherId);
//     if (row && dateRange.includes(att.date)) {
//       row[att.date] = att.leaveType;
//     }
//   });

//   return rows;
// };


// import { TeacherAttendanceResponse } from '../types/teacherAttendance';
import type { TeacherAttendanceResponse } from '../types/teacherAttendance';
import { getDatesInRange } from './dateUtils';

export interface TeacherRow {
  id: number;
  teacherName: string;
  [date: string]: any;
}

export const transformToCalendarData = (
  attendances: TeacherAttendanceResponse[],
  teachers: { id: number; name: string }[],
  startDate: Date,
  endDate: Date
): TeacherRow[] => {
  const dateRange = getDatesInRange(startDate, endDate);
  const rows: TeacherRow[] = teachers.map(t => ({
    id: t.id,
    teacherName: t.name,
  }));

  rows.forEach(row => {
    dateRange.forEach(date => {
      row[date] = null;
    });
  });

  attendances.forEach(att => {
    const row = rows.find(r => r.id === att.teacherId);
    if (row && dateRange.includes(att.date)) {
      row[att.date] = att.leaveType;
    }
  });

  return rows;
};