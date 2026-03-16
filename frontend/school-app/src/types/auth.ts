// // src/context/AuthContext.tsx
// // import type { AnyUser as User } from '../types/user';
// // ... rest unchanged
// import type { AnyUser } from './user';
// export type user = AnyUser;

// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface ChangePasswordRequest {
//   oldPassword: string;
//   newPassword: string;
// }

// export interface ApiResponse<T = any> {
//   message?: string;
//   data?: T;
// }

// export interface UserInfoResponse extends User {}

// src/types/auth.ts
import type { AnyUser } from './user';

// Re-export the rich user type from your main user types
export type User = AnyUser;

export interface LoginRequest {
  username: '';
  email: '';
  password: '';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}