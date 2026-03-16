// // hooks/useAttendance.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { attendanceService } from '../api/attendanceService';
// import type {
//   AttendanceFilter,
//   BulkAttendanceRequest,
//   UpdateAttendanceRequest,
//   AttendanceResponse,
// } from '../types/attendance';
// import type { PageResponse } from '../types/user';
// import toast from 'react-hot-toast';

// export const useAttendance = (filter: AttendanceFilter, page: number, enabled = true) => {
//   return useQuery<PageResponse<AttendanceResponse>>({
//     queryKey: ['attendance', filter, page],
//     queryFn: () => attendanceService.getAll(filter, page).then((res) => res.data),
//     enabled: enabled && !!filter.classId && !!filter.date, // require both
//     placeholderData: (prev) => prev,
//   });
// };

// export const useStudentAttendance = (studentId: number, page: number, enabled = true) => {
//   return useQuery<PageResponse<AttendanceResponse>>({
//     queryKey: ['attendance', 'student', studentId, page],
//     queryFn: () => attendanceService.getByStudent(studentId, page).then((res) => res.data),
//     enabled,
//     placeholderData: (prev) => prev,
//   });
// };

// export const useMarkBulkAttendance = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: BulkAttendanceRequest) => attendanceService.markBulk(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance'] });
//       toast.success('Attendance marked successfully');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Failed to mark attendance');
//     },
//   });
// };

// export const useUpdateAttendance = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }: { id: number; data: UpdateAttendanceRequest }) =>
//       attendanceService.update(id, data).then((res) => res.data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance'] });
//       toast.success('Attendance updated successfully');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Failed to update attendance');
//     },
//   });
// };


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../api/attendanceService';
import type {
  AttendanceFilter,
  BulkAttendanceRequest,
  UpdateAttendanceRequest,
  AttendanceResponse,
} from '../types/attendance';
import type { PageResponse } from '../types/user';
import toast from 'react-hot-toast';

export const useAttendance = (filter: AttendanceFilter, page: number, enabled = true) => {
  return useQuery<PageResponse<AttendanceResponse>>({
    queryKey: ['attendance', filter, page],
    queryFn: () => attendanceService.getAll(filter, page).then((res) => res.data),
    enabled: enabled && !!filter.classId && !!filter.date,
    placeholderData: (prev) => prev,
  });
};

export const useStudentAttendance = (studentId: number, page: number, enabled = true) => {
  return useQuery<PageResponse<AttendanceResponse>>({
    queryKey: ['attendance', 'student', studentId, page],
    queryFn: () => attendanceService.getByStudent(studentId, page).then((res) => res.data),
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useMarkBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkAttendanceRequest) => attendanceService.markBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAttendanceRequest }) =>
      attendanceService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    },
  });
  
};

export const useAttendanceRange = (classId?: number, startDate?: Date, endDate?: Date, enabled = true) => {
  return useQuery<AttendanceResponse[]>({
    queryKey: ['attendance', 'range', classId, startDate, endDate],
    queryFn: () => attendanceService.getRange(classId!, startDate!, endDate!).then(res => res.data),
    enabled: enabled && !!classId && !!startDate && !!endDate,
  });
};