// import axios from 'axios';
// import type { PageResponse } from '../types/user';
// import type { SubjectResponse } from '../types/class';
// import type { SubjectRequest } from '../types/subject';
// // import { SubjectRequest, SubjectResponse, PageResponse } from '../types/subject';

// const API_BASE_URL = 'http://localhost:8080/api/v1';

// const subjectService = {
//   getAllSubjects: (page = 0, size = 20, sort = 'name,asc'): Promise<PageResponse<SubjectResponse>> => {
//     return axios.get(`${API_BASE_URL}/subjects`, {
//       params: { page, size, sort }
//     }).then(response => response.data);
//   },

//   getSubjectById: (id: number): Promise<SubjectResponse> => {
//     return axios.get(`${API_BASE_URL}/subjects/${id}`).then(res => res.data);
//   },

//   createSubject: (subject: SubjectRequest): Promise<SubjectResponse> => {
//     return axios.post(`${API_BASE_URL}/subjects`, subject).then(res => res.data);
//   },

//   updateSubject: (id: number, subject: SubjectRequest): Promise<SubjectResponse> => {
//     return axios.put(`${API_BASE_URL}/subjects/${id}`, subject).then(res => res.data);
//   },

//   deleteSubject: (id: number): Promise<void> => {
//     return axios.delete(`${API_BASE_URL}/subjects/${id}`).then(() => {});
//   }
// };

// export default subjectService;

import apiClient from './axios'; // adjust path if needed
import type { PageResponse } from '../types/user';
import type { SubjectResponse } from '../types/class';
import type { SubjectRequest } from '../types/subject';

const BASE = '/subjects';

const subjectService = {
  getAllSubjects: (page = 0, size = 20, sort = 'name,asc') =>
    apiClient.get<PageResponse<SubjectResponse>>(BASE, {
      params: { page, size, sort },
    }),

  getSubjectById: (id: number) =>
    apiClient.get<SubjectResponse>(`${BASE}/${id}`),

  createSubject: (subject: SubjectRequest) =>
    apiClient.post<SubjectResponse>(BASE, subject),

  updateSubject: (id: number, subject: SubjectRequest) =>
    apiClient.put<SubjectResponse>(`${BASE}/${id}`, subject),

  deleteSubject: (id: number) =>
    apiClient.delete(`${BASE}/${id}`),
};

export default subjectService;