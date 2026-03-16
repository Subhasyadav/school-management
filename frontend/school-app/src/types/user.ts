
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

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
export type AnyUser = Teacher | Student | Parent | User;

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

