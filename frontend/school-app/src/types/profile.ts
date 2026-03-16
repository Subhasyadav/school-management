
// src/context/AuthContext.tsx
// ... rest unchanged
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// src/context/AuthContext.tsx

// ... rest unchanged
// export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Base user response (common fields)
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Teacher-specific fields
export interface Teacher extends User {
  qualification?: string;
  hireDate?: string; // ISO date
}

// Student-specific fields
export interface Student extends User {
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
}

// Parent-specific fields
export interface Parent extends User {
  occupation?: string;
}

// Union type for any user (used in lists)
// export type AnyUser = Teacher | Student | Parent | User;

// Request types
export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  // Teacher
  qualification?: string;
  hireDate?: string;
  // Student
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
  // Parent
  occupation?: string;
}

export interface UserUpdateRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Teacher
  qualification?: string;
  hireDate?: string;
  // Student
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
  // Parent
  occupation?: string;
}

export interface AssignParentRequest {
  parentId: number;
}

// Paginated response
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}


// src/context/AuthContext.tsx
// import type { AnyUser} from '../types/user';
// ... rest unchanged

// import type { AnyUser } from '../types/user';
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Base fields common to all users
interface BaseUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  createdAt: string;   // ISO date
  updatedAt: string;   // ISO date
}

// Teacher-specific response
export interface TeacherResponse extends BaseUser {
  role: 'TEACHER';
  qualification?: string | null;
  hireDate?: string | null; // ISO date
}

// Student-specific response
export interface StudentResponse extends BaseUser {
  role: 'STUDENT';
  enrollmentDate?: string | null; // ISO date
  dateOfBirth?: string | null;    // ISO date
  address?: string | null;
}

// Parent-specific response
export interface ParentResponse extends BaseUser {
  role: 'PARENT';
  occupation?: string | null;
}

// Admin (no extra fields)
export interface AdminResponse extends BaseUser {
  role: 'ADMIN';
}

// Union type for any user (used in lists, profile, etc.)
export type AnyUser = TeacherResponse | StudentResponse | ParentResponse | AdminResponse;

// Alias to keep backward compatibility with existing code
export type UserResponse = AnyUser;

// Request types for creating/updating users
export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  // Teacher
  qualification?: string;
  hireDate?: string;
  // Student
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
  // Parent
  occupation?: string;
}

export interface UserUpdateRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Teacher
  qualification?: string;
  hireDate?: string;
  // Student
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
  // Parent
  occupation?: string;
}

export interface AssignParentRequest {
  parentId: number;
}

// Paginated response
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}