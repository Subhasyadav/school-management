// import apiClient from './axios';
// import type { PageResponse } from '../types/user';
// import type { TeacherAttendanceResponse, BulkTeacherAttendanceRequest } from '../types/teacherAttendance';
// import type { LeaveType } from '../types/leaveType';

// const BASE = '/teacher-attendance';

// export const teacherAttendanceService = {
// //   getAll: (page = 0, size = 20) =>
// //     apiClient.get<PageResponse<TeacherAttendanceResponse>>(BASE, { params: { page, size } }),

// // api/teacherAttendanceService.ts
// getAll: (page = 0, size = 20) =>
//   apiClient.get<PageResponse<TeacherAttendanceResponse>>(BASE, { params: { page, size } }),

//   getMyAttendance: (page = 0, size = 20) =>
//     apiClient.get<PageResponse<TeacherAttendanceResponse>>(`${BASE}/me`, { params: { page, size } }),

//   markBulk: (data: BulkTeacherAttendanceRequest) =>
//     apiClient.post(`${BASE}/bulk`, data),

//   update: (id: number, data: { leaveType?: LeaveType; remarks?: string }) =>
//     apiClient.put<TeacherAttendanceResponse>(`${BASE}/${id}`, data),
// };

import apiClient from './axios';
import type { PageResponse } from '../types/user';
import type { TeacherAttendanceResponse, BulkTeacherAttendanceRequest } from '../types/teacherAttendance';
import type { LeaveType } from '../types/leaveType';

const BASE = '/teacher-attendance';

export const teacherAttendanceService = {
  getAll: (page = 0, size = 20) =>
    apiClient.get<PageResponse<TeacherAttendanceResponse>>(BASE, { params: { page, size } }),

  getMyAttendance: (page = 0, size = 20) =>
    apiClient.get<PageResponse<TeacherAttendanceResponse>>(`${BASE}/me`, { params: { page, size } }),

  markBulk: (data: BulkTeacherAttendanceRequest) =>
    apiClient.post(`${BASE}/bulk`, data),

  update: (id: number, data: { leaveType?: LeaveType; remarks?: string }) =>
    apiClient.put<TeacherAttendanceResponse>(`${BASE}/${id}`, data),
};