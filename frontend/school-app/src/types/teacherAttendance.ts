// // import { LeaveType } from './leaveType';

import type { LeaveType } from "./leaveType";

// import type { LeaveType } from "./leaveType";

// export interface TeacherAttendanceResponse {
//   id: number;
//   teacherId: number;
//   teacherName: string;
//   department?: string;
//   date: string;
//   leaveType: LeaveType | null;
//   remarks: string;
//   markedBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface TeacherAttendanceRecordRequest {
//   teacherId: number;
//   leaveType: LeaveType;
//   remarks?: string;
// }

// export interface BulkTeacherAttendanceRequest {
//   date: string;
//   records: TeacherAttendanceRecordRequest[];
// }

// import { LeaveType } from './leaveType';

export interface TeacherAttendanceResponse {
  id: number;
  teacherId: number;
  teacherName: string;
  department?: string;
  date: string;
  leaveType: LeaveType | null;
  remarks: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendanceRecordRequest {
  teacherId: number;
  leaveType: LeaveType;
  remarks?: string;
}

export interface BulkTeacherAttendanceRequest {
  date: string;
  records: TeacherAttendanceRecordRequest[];
}