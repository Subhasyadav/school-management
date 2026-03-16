import apiClient from './axios';
// import type { UserResponse } from '../types/user';
import type { PageResponse } from '../types/user';
import type { UserResponse } from '../types/profile';

export const childrenService = {
  getChildren: (parentId: number, page = 0, size = 10) =>
    apiClient.get<PageResponse<UserResponse>>(`/users/${parentId}/children`, {
      params: { page, size },
    }),
};