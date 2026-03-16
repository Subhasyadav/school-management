// // // types/attendance.ts
// // export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// // export interface AttendanceResponse {
// //   id: number;
// //   studentId: number;
// //   studentName: string;
// //   classId: number;
// //   className: string;
// //   date: string;          // YYYY-MM-DD
// //   status: AttendanceStatus;
// //   remarks: string;
// //   markedBy: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // export interface AttendanceFilter {
// //   classId?: number;
// //   date?: string;         // YYYY-MM-DD
// // }

// // export interface AttendanceRecordRequest {
// //   studentId: number;
// //   status: AttendanceStatus;
// //   remarks?: string;
// // }

// // export interface BulkAttendanceRequest {
// //   classId: number;
// //   date: string;
// //   records: AttendanceRecordRequest[];
// // }

// // export interface UpdateAttendanceRequest {
// //   status?: string | undefined;
// //   remarks?: string | undefined;
// // }



// export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// export interface AttendanceResponse {
//   id: number;
//   studentId: number;
//   studentName: string;
//   classId: number;
//   className: string;
//   subjectId?: number;
//   subjectName?: string;
//   date: string;
//   status: AttendanceStatus;
//   remarks: string;
//   markedBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface AttendanceFilter {
//   classId?: number;
//   date?: string;
// }

// export interface AttendanceRecordRequest {
//   studentId: number;
//   subjectId: number;
//   status: AttendanceStatus;
//   remarks?: string;
// }

// export interface BulkAttendanceRequest {
//   classId: number;
//   date: string;
//   records: AttendanceRecordRequest[];
// }

// export interface UpdateAttendanceRequest {
//   status?: AttendanceStatus;
//   remarks?: string;
// }

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceResponse {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  subjectId?: number;
  subjectName?: string;
  date: string;
  status: AttendanceStatus;
  remarks: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceFilter {
  classId?: number;
  date?: string;
}

export interface AttendanceRecordRequest {
  studentId: number;
  subjectId: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceRequest {
  classId: number;
  date: string;
  records: AttendanceRecordRequest[];
}

export interface UpdateAttendanceRequest {
  status?: AttendanceStatus;
  remarks?: string;
}