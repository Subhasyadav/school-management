// hooks/useGrades.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { GradeService } from '../api/GradeService'; // adjust import based on your export
import type { GradeFilterParams, GradeResponse, GradeCreateRequest, GradeUpdateRequest } from '../types/grade';
import type { PageResponse } from '../types/user';
import toast from 'react-hot-toast';

export const useGrades = (
  filter: GradeFilterParams,
  page: number,
  enabled: boolean = true
): UseQueryResult<PageResponse<GradeResponse>> => {
  return useQuery({
    queryKey: ['grades', filter, page],
    queryFn: () => GradeService.getAll(filter, page).then((res) => res.data),
    enabled,
    placeholderData: keepPreviousData, // ✅ v5 syntax
  });
};

export const useStudentGrades = (
  studentId: number,
  page: number,
  enabled: boolean = true
): UseQueryResult<PageResponse<GradeResponse>> => {
  return useQuery({
    queryKey: ['grades', 'student', studentId, page],
    queryFn: () => GradeService.getByStudent(studentId, page).then((res) => res.data),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GradeCreateRequest) => GradeService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast.success('Grade created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create grade');
    },
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeUpdateRequest }) =>
      GradeService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast.success('Grade updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update grade');
    },
  });
};

export const useDeleteGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => GradeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast.success('Grade deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete grade');
    },
  });
};