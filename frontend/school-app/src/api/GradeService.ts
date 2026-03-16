// api/GradeService.ts
import apiClient from './axios';
import type { GradeResponse, GradeCreateRequest, GradeUpdateRequest, GradeFilterParams } from '../types/grade';
import type { PageResponse } from '../types/user';

export const GradeService = {
  getAll: (filter: GradeFilterParams, page: number, size = 20) =>
    apiClient.get<PageResponse<GradeResponse>>('/grades', { params: { ...filter, page, size } }),

  getByStudent: (studentId: number, page: number, size = 20) =>
    apiClient.get<PageResponse<GradeResponse>>(`/grades/student/${studentId}`, { params: { page, size } }),

  create: (data: GradeCreateRequest) =>
    apiClient.post<GradeResponse>('/grades', data),

  update: (id: number, data: GradeUpdateRequest) =>
    apiClient.put<GradeResponse>(`/grades/${id}`, data),

  delete: (id: number) => apiClient.delete(`/grades/${id}`),
};