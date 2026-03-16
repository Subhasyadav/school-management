import type { AnyUser, PageResponse, UserCreateRequest, UserUpdateRequest } from '../types/user';
import apiClient from './axios';

const API_BASE = '/users';

// Map frontend role names to backend endpoint names
const ROLE_ENDPOINTS: Record<string, string> = {
  ADMIN: 'admins',
  TEACHER: 'teachers',
  STUDENT: 'students',
  PARENT: 'parents',
};

export const userApi = {
  getAll: (page = 0, size = 10) =>
    apiClient.get<PageResponse<AnyUser>>(API_BASE, { params: { page, size } }),

  getByRole: (role: string, page = 0, size = 10) => {
    const endpoint = ROLE_ENDPOINTS[role.toUpperCase()];
    if (!endpoint) throw new Error(`Unknown role: ${role}`);
    return apiClient.get<PageResponse<AnyUser>>(`${API_BASE}/${endpoint}`, { params: { page, size } });
  },

  getById: (id: number) =>
    apiClient.get<AnyUser>(`${API_BASE}/${id}`),

  create: (data: UserCreateRequest) =>
    apiClient.post<AnyUser>(API_BASE, data),

  update: (id: number, data: UserUpdateRequest) =>
    apiClient.put<AnyUser>(`${API_BASE}/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`${API_BASE}/${id}`),

  assignParent: (studentId: number, parentId: number) =>
    apiClient.post(`${API_BASE}/${studentId}/parents`, { parentId }),

  getChildren: (parentId: number, page = 0, size = 100) =>
    apiClient.get<PageResponse<AnyUser>>(`/users/${parentId}/children`, {
      params: { page, size },
    }),

    
};