import apiClient from "./api/axios";
import type{ AssignmentResponse, SubmissionRequest, AssignmentCreateRequest, AssignmentUpdateRequest } from "./types/assignment";
import type{ PageResponse } from "./types/user";

const BASE = '/assignments';

export const assignmentService = {
    getAll: (classId? : number, studentId?: number, page = 0 , size = 10) => 
        apiClient.get<PageResponse<AssignmentResponse>>(BASE, {
            params: {classId, studentId, page, size},
        }),

    getById: (id: number) => 
        apiClient.get<AssignmentResponse>(`${BASE}/${id}`),

    create: (data: AssignmentCreateRequest) => {
        const formData = new FormData();
        formData.append('title', data.title);
        if(data.description) formData.append('description', data.description);
        formData.append('classId', String(data.classId));
        formData.append('subjectId', String(data.subjectId));
        formData.append('dueDate', data.dueDate);
        if(data.attachment) formData.append('attachment', data.attachment);
        if(data.status) formData.append('status', data.status);
        if(data.publishDate) formData.append('publishDate', data.publishDate);
        if(data.allowLateSubmission) formData.append('allowLateSubmission', String(data.allowLateSubmission));
        if(data.anonymousGrading !== undefined)
            formData.append('anonymousGrading', String(data.anonymousGrading));
        if(data.latePenaltyPercent !== undefined) formData.append('latePenaltyPercent', String(data.latePenaltyPercent));
        return apiClient.post<AssignmentResponse>(BASE, formData, {
            headers: { 'Content-Type' : 'multipart/form-data'},
        });
    },

    update: (id: number, data: AssignmentUpdateRequest) => {
        const formData = new FormData();
        if(data.title) formData.append('title', data.title);
        if(data.description) formData.append('description', data.description);
        if(data.classId) formData.append('classId', String(data.classId));
        if(data.subjectId) formData.append('subjectId', String(data.subjectId));
        if(data.dueDate) formData.append('dueDate', data.dueDate);
        if(data.attachment) formData.append('attachment', data.attachment);
        if(data.status) formData.append('status', data.status);
        if(data.publishDate) formData.append('publish', data.publishDate);
        if(data.allowLateSubmission !== undefined) formData.append('allowLateSubmission', String(data.allowLateSubmission));
        if(data.latePenaltyPercent !== undefined) formData.append('latePenaltyPercent', String(data.latePenaltyPercent));
        if(data.anonymousGrading !== undefined) formData.append('anonymousGrading', String(data.anonymousGrading));
        
        return apiClient.put<AssignmentUpdateRequest>(`${BASE}/${id}`, formData , {
            headers: { 'Content-Type' : 'multipart/form-data'},
        });
    },

    delete: (id: number) => apiClient.delete(`${BASE}/${id}`),

    publish: (id: number) => apiClient.patch<AssignmentResponse>(`${BASE}/${id}/publish`),

    getSubmissionForAssignment: (assignmentId: number, page = 0, size = 20) =>
        apiClient.get<PageResponse<SubmissionRequest>>(`${BASE}/${assignmentId}/submissions`, {
            params: {page, size}
        }),

    submit: (assignmentId: number, data: SubmissionRequest) => {
        const formData = new FormData();
        formData.append('file', data.file);
        return apiClient.post<SubmissionRequest>(`${BASE}/${assignmentId}/submit`, formData, {
            headers: {'Content-Type' : 'multipart/form-data'},
        });
    },

    grade: (submissionId: number, data: SubmissionRequest) =>
        apiClient.put<SubmissionRequest>(`${BASE}/submissions/${submissionId}/grade`, data),

    getSubmissionByStudent: (studentId: number, page = 0, size = 20) =>
        apiClient.get<PageResponse<SubmissionRequest>>(`${BASE}/submissions/student/${studentId}`, {
            params: {page, size},
        }),

    getChildrenAssignments: (parentId: number, page = 0, size = 10) => 
        apiClient.get<PageResponse<AssignmentResponse>>(`${BASE}/parents/${parentId}/children`, {
            params: {page, size},
        }),
};