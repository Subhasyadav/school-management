// import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
// import { PageResponse } from "./types/user"
// import { AssignmentResponse, type AssignmentCreateRequest, type AssignmentUpdateRequest } from "./types/assignment"
// import { assignmentService } from "./api/assignmentService"
// import toast from "react-hot-toast";
// import AssignmentManagement from "./pages/assignments/AssignmentModel";
// import { number } from "zod";

// export const useAssignments = (classId?: number, studentId?: number, page = 0) => {
//     return useQuery<PageResponse<AssignmentResponse>>({
//         queryKey: ['assignments', { classId, studentId, page}],
//         queryFn: () => assignmentService.getAll(classId, studentId, page).then(res => res.data),
//         placeholderData: (prev) => prev, 
//     });
// };

// export const useCreateAssignment = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: AssignmentCreateRequest) => assignmentService.create(data).then(res => res.data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['assignments']});
//             toast.success('Assignment created successfully');
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || "Failed to create assignment");
//         },
//     });
// };

// // export const useUpdateAssignment = () => {
// //     const queryClient = useQueryClient();
// //     return useMutation({
// //         mutationFn: ({id, data}: {id: number; data: AssignmentUpdateRequest}) => 
// //             assignmentService.update(id, data).then(res => res.data),
// //         onSuccess: (_, variables) => {
// //             queryClient.invalidateQueries({queryKey: ['assignments']});
// //             queryClient.invalidateQueries({queryKey: ['assignment', variables.id]});
// //             toast.success('Assignment updated successfully');
// //         },
// //         onError: (error: any) => {
// //             toast.error(error.response?.data?.message || 'Failed to update assignment');
// //         },
// //     });
// // };

// export const useUpdateAssignment = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({id, data}: {id: number; data: AssignmentUpdateRequest}) => 
//             assignmentService.update(id, data).then(res => res.data),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({queryKey: ['assignments']});
//             queryClient.invalidateQueries({queryKey: ['assignment', variables.id]});
//             toast.success('Assignment updated Successfully');
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to update Assignment');
//         }
//     })
// }