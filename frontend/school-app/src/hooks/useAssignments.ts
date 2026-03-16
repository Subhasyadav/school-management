import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../api/assignmentService';
import type {
  AssignmentResponse,
  AssignmentCreateRequest,
  AssignmentUpdateRequest,
  SubmissionRequest,
  GradeSubmissionRequest,
  SubmissionResponse,
} from '../types/assignment';
import type { PageResponse } from '../types/user';
import toast from 'react-hot-toast';

export const useAssignments = (classId?: number, studentId?: number, page = 0) => {
  return useQuery<PageResponse<AssignmentResponse>>({
    queryKey: ['assignments', { classId, studentId, page }],
    queryFn: () => assignmentService.getAll(classId, studentId, page).then(res => res.data),
    placeholderData: (prev) => prev,
  });
};

export const useAssignment = (id: number) => {
  return useQuery<AssignmentResponse>({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentCreateRequest) => assignmentService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignmentUpdateRequest }) =>
      assignmentService.update(id, data).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
      toast.success('Assignment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assignmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
    },
  });
};

export const usePublishAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assignmentService.publish(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', id] });
      toast.success('Assignment published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish assignment');
    },
  });
};

// Submissions
// export const useSubmissionsForAssignment = (assignmentId: number, page = 0) => {
//   return useQuery<PageResponse<SubmissionResponse>>({
//     queryKey: ['submissions', 'assignment', assignmentId, page],
//     queryFn: () => assignmentService.getSubmissionsForAssignment(assignmentId, page).then(res => res.data),
//     enabled: !!assignmentId,
//   });
// };

export const useSubmitAssignment = (assignmentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmissionRequest) => assignmentService.submit(assignmentId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', 'assignment', assignmentId] });
      toast.success('Assignment submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    },
  });
};

export const useGradeSubmission = (submissionId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GradeSubmissionRequest) => assignmentService.grade(submissionId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Grade saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to grade submission');
    },
  });
};

export const useSubmissionsByStudent = (studentId: number, page = 0) => {
  return useQuery<PageResponse<SubmissionResponse>>({
    queryKey: ['submissions', 'student', studentId, page],
    queryFn: () => assignmentService.getSubmissionsByStudent(studentId, page).then(res => res.data),
    enabled: !!studentId,
  });
};

// NEW: Get assignments for parent's children
export const useChildrenAssignments = (parentId: number, page = 0) => {
  return useQuery<PageResponse<AssignmentResponse>>({
    queryKey: ['childrenAssignments', parentId, page],
    queryFn: () => assignmentService.getChildrenAssignments(parentId, page).then(res => res.data),
    enabled: !!parentId,
  });
};

export const useSubmissionsForAssignment = (assignmentId: number, page = 0, options?: { enabled?: boolean }) => {
  return useQuery<PageResponse<SubmissionResponse>>({
    queryKey: ['submissions', 'assignment', assignmentId, page],
    queryFn: () => assignmentService.getSubmissionsForAssignment(assignmentId, page).then(res => res.data),
    enabled: !!assignmentId && (options?.enabled ?? true),
  });
};