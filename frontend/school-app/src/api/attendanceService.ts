// // api/attendanceService.ts
// import apiClient from './axios';
// import type {
//   AttendanceResponse,
//   AttendanceFilter,
//   BulkAttendanceRequest,
//   UpdateAttendanceRequest,
// } from '../types/attendance';
// import type { PageResponse } from '../types/user';

// const BASE = '/attendance';

// export const attendanceService = {
//   getAll: (filter: AttendanceFilter, page = 0, size = 20) =>
//     apiClient.get<PageResponse<AttendanceResponse>>(BASE, {
//       params: { ...filter, page, size },
//     }),

//   getByStudent: (studentId: number, page = 0, size = 20) =>
//     apiClient.get<PageResponse<AttendanceResponse>>(`${BASE}/student/${studentId}`, {
//       params: { page, size },
//     }),

//   markBulk: (data: BulkAttendanceRequest) =>
//     apiClient.post(`${BASE}/bulk`, data),

//   update: (id: number, data: UpdateAttendanceRequest) =>
//     apiClient.put<AttendanceResponse>(`${BASE}/${id}`, data),
// };


import apiClient from './axios';
import type {
  AttendanceResponse,
  AttendanceFilter,
  BulkAttendanceRequest,
  UpdateAttendanceRequest,
} from '../types/attendance';
import type { PageResponse } from '../types/user';

const BASE = '/attendance';

export const attendanceService = {
  getAll: (filter: AttendanceFilter, page = 0, size = 20) =>
    apiClient.get<PageResponse<AttendanceResponse>>(BASE, {
      params: { ...filter, page, size },
    }),

  getByStudent: (studentId: number, page = 0, size = 20) =>
    apiClient.get<PageResponse<AttendanceResponse>>(`${BASE}/student/${studentId}`, {
      params: { page, size },
    }),

  markBulk: (data: BulkAttendanceRequest) =>
    apiClient.post(`${BASE}/bulk`, data),

  update: (id: number, data: UpdateAttendanceRequest) =>
    apiClient.put<AttendanceResponse>(`${BASE}/${id}`, data),

  getRange: (classId: number, startDate: Date, endDate: Date) =>
  apiClient.get<AttendanceResponse[]>(`${BASE}/range`, {
    params: { classId, startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }
  }),
};