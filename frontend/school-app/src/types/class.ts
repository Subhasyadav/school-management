// Base user response (reused from your user types, but adding specific fields)
export interface TeacherResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'TEACHER';
  qualification?: string;
  hireDate?: string;
}

export interface StudentResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'STUDENT';
  enrollmentDate?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface SubjectResponse {
  id: number;
  name: string;
  code: string;
}

export interface ClassSubjectResponse {
  id: number;
  subject: SubjectResponse;
  teacher: TeacherResponse | null;
}

export interface ClassRoomResponse {
  id: number;
  name: string;
  academicYear: string;
  classTeacher: TeacherResponse | null;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
  className: string;
}

// Requests
export interface ClassCreateRequest {
  name: string;
  academicYear: string;
  classTeacherId?: number;
}

export interface ClassUpdateRequest {
  name?: string;
  academicYear?: string;
  classTeacherId?: number;
}

export interface EnrollStudentRequest {
  studentId: number;
}

export interface AssignTeacherRequest {
  teacherId: number;
}

// Add these interfaces to your existing class.ts
// export interface SubjectResponse {
//   id: number;
//   name: string;
//   code?: string;
// }

// export interface ClassSubjectResponse {
//   id: number;
//   subjectId: number;
//   subjectName: string;
//   // other fields as needed
// }
