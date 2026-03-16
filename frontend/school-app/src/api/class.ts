// import apiClient from './axios';
// import type {
//   ClassRoomResponse,
//   ClassCreateRequest,
//   ClassUpdateRequest,
//   StudentResponse,
//   ClassSubjectResponse,
//   EnrollStudentRequest,
//   AssignTeacherRequest,
// } from '../types/class';
// import type { PageResponse } from '../types/user'; // reuse your existing PageResponse

// const BASE = '/classes';

// export const classService = {
//   // 5.3.1 GET /classes
//   getAll: (page = 0, size = 10, sort = 'id,asc') =>
//     apiClient.get<PageResponse<ClassRoomResponse>>(BASE, {
//       params: { page, size, sort },
//     }),

//   // 5.3.2 GET /classes/{id}
//   getById: (id: number) => apiClient.get<ClassRoomResponse>(`${BASE}/${id}`),

//   // 5.3.3 POST /classes
//   create: (data: ClassCreateRequest) =>
//     apiClient.post<ClassRoomResponse>(BASE, data),

//   // 5.3.4 PUT /classes/{id}
//   update: (id: number, data: ClassUpdateRequest) =>
//     apiClient.put<ClassRoomResponse>(`${BASE}/${id}`, data),

//   // 5.3.5 DELETE /classes/{id}
//   delete: (id: number) => apiClient.delete(`${BASE}/${id}`),

//   // 5.3.6 GET /classes/{id}/students
//   getStudents: (id: number, page = 0, size = 20) =>
//     apiClient.get<PageResponse<StudentResponse>>(`${BASE}/${id}/students`, {
//       params: { page, size },
//     }),

//   // 5.3.7 POST /classes/{id}/enroll
//   enrollStudent: (id: number, studentId: number) =>
//     apiClient.post(`${BASE}/${id}/enroll`, { studentId } as EnrollStudentRequest),

//   // 5.3.8 DELETE /classes/{id}/enroll/{studentId}
//   removeStudent: (classId: number, studentId: number) =>
//     apiClient.delete(`${BASE}/${classId}/enroll/${studentId}`),

//   // 5.3.9 GET /classes/{id}/subjects
//   getSubjects: (id: number, page = 0, size = 20) =>
//     apiClient.get<PageResponse<ClassSubjectResponse>>(`${BASE}/${id}/subjects`, {
//       params: { page, size },
//     }),

//   // Additional: assign teacher to subject
//   assignTeacher: (classId: number, subjectId: number, teacherId: number) =>
//     apiClient.post(`${BASE}/${classId}/subjects/${subjectId}/assign-teacher`, {
//       teacherId,
//     } as AssignTeacherRequest),
// };

import apiClient from './axios';
import type {
  ClassRoomResponse,
  ClassCreateRequest,
  ClassUpdateRequest,
  StudentResponse,
  ClassSubjectResponse,
  EnrollStudentRequest,
  AssignTeacherRequest,
  SubjectResponse,
} from '../types/class';
import type { PageResponse } from '../types/user';

const BASE = '/classes';

export const classService = {
  // 5.3.1 GET /classes
  getAll: (page = 0, size = 10, sort = 'id,asc') =>
    apiClient.get<PageResponse<ClassRoomResponse>>(BASE, {
      params: { page, size, sort },
    }),

  // 5.3.2 GET /classes/{id}
  getById: (id: number) => apiClient.get<ClassRoomResponse>(`${BASE}/${id}`),

  // 5.3.3 POST /classes
  create: (data: ClassCreateRequest) =>
    apiClient.post<ClassRoomResponse>(BASE, data),

  // 5.3.4 PUT /classes/{id}
  update: (id: number, data: ClassUpdateRequest) =>
    apiClient.put<ClassRoomResponse>(`${BASE}/${id}`, data),

  // 5.3.5 DELETE /classes/{id}
  delete: (id: number) => apiClient.delete(`${BASE}/${id}`),

  // 5.3.6 GET /classes/{id}/students
  getStudents: (id: number, page = 0, size = 20) =>
    apiClient.get<PageResponse<StudentResponse>>(`${BASE}/${id}/students`, {
      params: { page, size },
    }),

  // 5.3.7 POST /classes/{id}/enroll
  enrollStudent: (id: number, studentId: number) =>
    apiClient.post(`${BASE}/${id}/enroll`, { studentId } as EnrollStudentRequest),

  // 5.3.8 DELETE /classes/{id}/enroll/{studentId}
  removeStudent: (classId: number, studentId: number) =>
    apiClient.delete(`${BASE}/${classId}/enroll/${studentId}`),

  // 5.3.9 GET /classes/{id}/subjects
  getSubjects: (id: number, page = 0, size = 20) =>
    apiClient.get<PageResponse<ClassSubjectResponse>>(`${BASE}/${id}/subjects`, {
      params: { page, size },
    }),

  // NEW: Assign subjects to a class (POST /classes/{id}/subjects)
  assignSubjects: (classId: number, subjectIds: number[]) =>
  apiClient.post(`${BASE}/${classId}/subjects`, { subjectIds }),

  // Additional: assign teacher to a subject
  assignTeacher: (classId: number, subjectId: number, teacherId: number) =>
    apiClient.post(`${BASE}/${classId}/subjects/${subjectId}/assign-teacher`, {
      teacherId,
    } as AssignTeacherRequest),

    getSubject: (classId: number, page = 0, size = 100) =>
    apiClient.get<PageResponse<SubjectResponse>>(`/classes/${classId}/subjects`, {
      params: { page, size },
    }),
};