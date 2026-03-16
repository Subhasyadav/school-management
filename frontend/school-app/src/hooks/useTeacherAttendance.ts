// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { teacherAttendanceService } from '../api/teacherAttendanceService';
// import type { BulkTeacherAttendanceRequest, TeacherAttendanceResponse } from '../types/teacherAttendance';
// import type { PageResponse } from '../types/user';
// import toast from 'react-hot-toast';
// import type { LeaveType } from '../types/leaveType';
// // import { LeaveType } from '../types/leaveType';

// // export const useAllTeacherAttendance = (page: number, enabled = true) => {
// //   return useQuery<PageResponse<TeacherAttendanceResponse>>({
// //     queryKey: ['teacherAttendance', 'all', page],
// //     queryFn: () => teacherAttendanceService.getAll(page).then((res) => res.data),
// //     enabled,
// //     placeholderData: (prev) => prev,
// //   });
// // };

// export const useMyTeacherAttendance = (page: number, enabled = true) => {
//   return useQuery<PageResponse<TeacherAttendanceResponse>>({
//     queryKey: ['teacherAttendance', 'me', page],
//     queryFn: () => teacherAttendanceService.getMyAttendance(page).then((res) => res.data),
//     enabled,
//     placeholderData: (prev) => prev,
//   });
// };

// export const useMarkTeacherAttendance = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: BulkTeacherAttendanceRequest) => teacherAttendanceService.markBulk(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['teacherAttendance'] });
//       toast.success('Teacher attendance marked successfully');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Failed to mark teacher attendance');
//     },
//   });
// };

// export const useUpdateTeacherAttendance = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }: { id: number; data: { leaveType?: LeaveType; remarks?: string } }) =>
//       teacherAttendanceService.update(id, data).then((res) => res.data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['teacherAttendance'] });
//       toast.success('Teacher attendance updated');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Failed to update');
//     },
//   });
// };


// // hooks/useTeacherAttendance.ts (partial)
// export const useAllTeacherAttendance = (page: number, size: number = 20, enabled = true) => {
//   return useQuery<PageResponse<TeacherAttendanceResponse>>({
//     queryKey: ['teacherAttendance', 'all', page, size],
//     queryFn: () => teacherAttendanceService.getAll(page, size).then((res) => res.data),
//     enabled,
//     placeholderData: (prev) => prev,
//   });
// };


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherAttendanceService } from '../api/teacherAttendanceService';
import type { BulkTeacherAttendanceRequest, TeacherAttendanceResponse } from '../types/teacherAttendance';
import type { PageResponse } from '../types/user';
import toast from 'react-hot-toast';
import type { LeaveType } from '../types/leaveType';

export const useAllTeacherAttendance = (page: number, size: number = 20, enabled = true) => {
  return useQuery<PageResponse<TeacherAttendanceResponse>>({
    queryKey: ['teacherAttendance', 'all', page, size],
    queryFn: () => teacherAttendanceService.getAll(page, size).then((res) => res.data),
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useMyTeacherAttendance = (page: number, size: number = 20, enabled = true) => {
  return useQuery<PageResponse<TeacherAttendanceResponse>>({
    queryKey: ['teacherAttendance', 'me', page, size],
    queryFn: () => teacherAttendanceService.getMyAttendance(page, size).then((res) => res.data),
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useMarkTeacherAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkTeacherAttendanceRequest) => teacherAttendanceService.markBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAttendance'] });
      toast.success('Teacher attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark teacher attendance');
    },
  });
};

export const useUpdateTeacherAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { leaveType?: LeaveType; remarks?: string } }) =>
      teacherAttendanceService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAttendance'] });
      toast.success('Teacher attendance updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update');
    },
  });
};