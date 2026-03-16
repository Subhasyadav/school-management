// import apiClient from './axios';
// // import type { UserResponse } from '../types/user';
// import type { ProfileUpdateRequest, ChangePasswordRequest, UserResponse } from '../types/profile';
// // import type { UserResponse } from '../types/user';

// export const profileApi = {
//   // Get current user profile
//   getProfile: () => apiClient.get<UserResponse>('/profile'),

//   // Update profile (firstName, lastName, phone)
//   updateProfile: (data: ProfileUpdateRequest) => apiClient.put<UserResponse>('/profile', data),
  

//   // Change password – adjust endpoint as per your backend (e.g., /auth/change-password)
//   changePassword: (data: ChangePasswordRequest) => apiClient.post('/auth/change-password', data),
// };

import type { UserResponse } from '../types/profile';
import apiClient from './axios';
// import type { UserResponse } from '../types/user'; // Use the unified user type

// Define the request types inline (or import them if they already exist)
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const profileApi = {
  // Get current user profile
  getProfile: () => apiClient.get<UserResponse>('/profile'),

  // Update profile (firstName, lastName, phone)
  updateProfile: (data: ProfileUpdateRequest) =>
    apiClient.put<UserResponse>('/profile', data),

  // Change password – now uses the correct payload structure
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post('/auth/change-password', data),
};