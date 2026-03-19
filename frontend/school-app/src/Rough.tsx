import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PageResponse } from "./types/user"
import type { SubmissionResponse, AssignmentCreateRequest, AssignmentResponse, AssignmentUpdateRequest, GradeSubmissionRequest, SubmissionRequest } from "./types/assignment"
import { assignmentService } from "./api/assignmentService"
import toast from "react-hot-toast";

export const useAssignments = (classId?: number, studentId?: number , page = 0) => {
    return useQuery<PageResponse<AssignmentResponse>>({
        queryKey: ['assignment', classId, studentId, page],
        queryFn: () => assignmentService.getAll(classId, studentId,page).then((res) => res.data),
        placeholderData: (prev) => prev,
    });
};

export const useAssignment = (id: number) => {
    return useQuery<AssignmentResponse>({
        queryKey: ['assignment', id],
        queryFn: () => assignmentService.getById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AssignmentCreateRequest) => assignmentService.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignment']});
            toast.success('Assignment created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to Create Assignment');
        },
    });
};

export const updateAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id,data}: {id:number, data: AssignmentUpdateRequest}) => assignmentService.update(id, data).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['assignments']});
            queryClient.invalidateQueries({ queryKey: ['assignment',variables.id]});
            toast.success('Assignment updated Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update Assignment');
        }
    })
}

export const useDeleteAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => assignmentService.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignments']});
            toast.success('Assignment Deleted Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to Deleted Assignment');
        },
    });
};

export const usePublishAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => assignmentService.publish(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignments']});
            toast.success('Assignment Published Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to Published Assignment');
        }
    })
}

export const useSubmitAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({assignmentId, data}: {assignmentId: number, data: SubmissionRequest}) => assignmentService.submit(assignmentId,data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions']});
            toast.success('Assignment Submitted Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message);
        },
    });
};

export const useGradeSubmission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({submissionId, data}: {submissionId: number, data: GradeSubmissionRequest}) => assignmentService.grade(submissionId,data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions']});
            toast.success('Grade saved Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to saved grade');
        },
    });
};

export const useSubmissionByStudent = (studentId: number, page = 0) => {
    return useQuery<PageResponse<SubmissionResponse>>({
        queryKey: ['submissions', 'student', studentId, page],
        queryFn: () => assignmentService.getSubmissionsByStudent(studentId,page).then((res) => res.data),
        enabled: !!studentId,
    });
};

export const useChildrenAssignments = (parentId: number, page = 0) => {
    return useQuery<PageResponse<AssignmentResponse>>({
        queryKey: ['childrenAssignment',parentId, page],
        queryFn: () => assignmentService.getChildrenAssignments(parentId, page).then(res => res.data),
        enabled: !!parentId,
    });
};

export const useSubmissionForAssignment = (assignmentId: number, page = 0, options?: {enabled?: boolean}) => {
    return useQuery<PageResponse<SubmissionResponse>>({
        queryKey: ['submissions', 'assignment', assignmentId, page],
        queryFn: () => assignmentService.getSubmissionsForAssignment(assignmentId, page).then((res) => res.data),
        enabled: !!assignmentId && (options?.enabled ?? true)
    })
}