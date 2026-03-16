// // // // // // components/GradeManagement.tsx
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { useAuth } from '../../context/AuthContext';
// // // // // import type { GradeFilterParams, GradeResponse } from '../../types/grade';
// // // // // // import { useGrades, useStudentGrades, useDeleteGrade } from '../hooks/useGrades';
// // // // // // import GradeFormModal from './GradeFormModal';
// // // // // // import { useDebounce } from '../hooks/useDebounce';
// // // // // import toast from 'react-hot-toast';
// // // // // import { useDebounce } from '../../hooks/useDebounce';
// // // // // import { useDeleteGrade, useGrades, useStudentGrades } from '../../hooks/useGrade';
// // // // // import GradeFormModal from './GradeFormModel';
// // // // // import Layout from '../../component/layout';

// // // // // const PAGE_SIZE = 20;

// // // // // const GradeManagement: React.FC = () => {
// // // // //   const { user } = useAuth();
// // // // //   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// // // // //   const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';

// // // // //   const [filter, setFilter] = useState<GradeFilterParams>({});
// // // // //   const debouncedFilter = useDebounce(filter, 300);
// // // // //   const [page, setPage] = useState(0);
// // // // //   const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // // //   const isStudentView = !canViewAll && user?.role === 'STUDENT';
// // // // //   const studentId = isStudentView ? user!.id : undefined;

// // // // //   const {
// // // // //     data: gradesData,
// // // // //     isLoading,
// // // // //     isError,
// // // // //     error,
// // // // //     refetch,
// // // // //   } = isStudentView
// // // // //     ? useStudentGrades(studentId!, page, true)
// // // // //     : useGrades(debouncedFilter, page, true);

// // // // //   const deleteMutation = useDeleteGrade();

// // // // //   useEffect(() => {
// // // // //     if (isError && error) {
// // // // //       toast.error('Failed to load grades');
// // // // //     }
// // // // //   }, [isError, error]);

// // // // //   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // //     const { name, value } = e.target;
// // // // //     setFilter((prev) => ({
// // // // //       ...prev,
// // // // //       [name]: value ? Number(value) : undefined,
// // // // //     }));
// // // // //     setPage(0);
// // // // //   };

// // // // //   const handleDelete = async (id: number) => {
// // // // //     if (!window.confirm('Are you sure you want to delete this grade?')) return;
// // // // //     try {
// // // // //       await deleteMutation.mutateAsync(id);
// // // // //       if (gradesData?.content.length === 1 && page > 0) {
// // // // //         setPage(p => p - 1);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       // error toast handled by mutation
// // // // //     }
// // // // //   };

// // // // //   const openModalForCreate = () => {
// // // // //     setSelectedGrade(null);
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const openModalForEdit = (grade: GradeResponse) => {
// // // // //     setSelectedGrade(grade);
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const totalPages = gradesData?.totalPages || 0;
// // // // //   const canNext = page < totalPages - 1;
// // // // //   const canPrev = page > 0;

// // // // //   return (
// // // // //     <Layout>
// // // // //     <div className="p-6">
// // // // //       <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

// // // // //       {canViewAll && (
// // // // //         <div className="flex gap-2 mb-4">
// // // // //           <input
// // // // //             type="string"
// // // // //             name="classId"
// // // // //             placeholder="Class ID"
// // // // //             value={filter.classId ?? ''}
// // // // //             onChange={handleFilterChange}
// // // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //             aria-label="Filter by class ID"
// // // // //           />
// // // // //           <input
// // // // //             type="string"
// // // // //             name="subjectId"
// // // // //             placeholder="Subject ID"
// // // // //             value={filter.subjectId ?? ''}
// // // // //             onChange={handleFilterChange}
// // // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //             aria-label="Filter by subject ID"
// // // // //           />
// // // // //           <input
// // // // //             type="string"
// // // // //             name="studentId"
// // // // //             placeholder="Student ID"
// // // // //             value={filter.studentId ?? ''}
// // // // //             onChange={handleFilterChange}
// // // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //             aria-label="Filter by student ID"
// // // // //           />
// // // // //         </div>
// // // // //       )}

// // // // //       {canManage && (
// // // // //         <button
// // // // //           onClick={openModalForCreate}
// // // // //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //         >
// // // // //           Add Grade
// // // // //         </button>
// // // // //       )}

// // // // //       {isLoading && (
// // // // //         <div className="text-center py-8 text-gray-500">Loading grades...</div>
// // // // //       )}

// // // // //       {!isLoading && gradesData?.content.length === 0 && (
// // // // //         <div className="text-center py-8 text-gray-500">No grades found.</div>
// // // // //       )}

// // // // //       {!isLoading && gradesData && gradesData.content.length > 0 && (
// // // // //         <>
// // // // //           <div className="overflow-x-auto bg-white rounded-lg shadow">
// // // // //             <table className="min-w-full divide-y divide-gray-200">
// // // // //               <thead className="bg-gray-50">
// // // // //                 <tr>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
// // // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
// // // // //                   {canManage && (
// // // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// // // // //                   )}
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody className="bg-white divide-y divide-gray-200">
// // // // //                 {gradesData.content.map((g) => (
// // // // //                   <tr key={g.id} className="hover:bg-gray-50">
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // // // //                       {new Date(g.examDate).toLocaleDateString()}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // // // //                       {g.marksObtained} / {g.maxMarks}
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
// // // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
// // // // //                     {canManage && (
// // // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
// // // // //                         <button
// // // // //                           onClick={() => openModalForEdit(g)}
// // // // //                           className="text-indigo-600 hover:text-indigo-900"
// // // // //                         >
// // // // //                           Edit
// // // // //                         </button>
// // // // //                         <button
// // // // //                           onClick={() => handleDelete(g.id)}
// // // // //                           className="text-red-600 hover:text-red-900"
// // // // //                         >
// // // // //                           Delete
// // // // //                         </button>
// // // // //                       </td>
// // // // //                     )}
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>

// // // // //           {/* Pagination */}
// // // // //           <div className="flex items-center justify-center gap-4 mt-4">
// // // // //             <button
// // // // //               onClick={() => setPage(p => p - 1)}
// // // // //               disabled={!canPrev}
// // // // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // // // //             >
// // // // //               Previous
// // // // //             </button>
// // // // //             <span className="text-sm text-gray-700">
// // // // //               Page {page + 1} of {totalPages}
// // // // //             </span>
// // // // //             <button
// // // // //               onClick={() => setPage(p => p + 1)}
// // // // //               disabled={!canNext}
// // // // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // // // //             >
// // // // //               Next
// // // // //             </button>
// // // // //           </div>
// // // // //         </>
// // // // //       )}

// // // // //       {isModalOpen && (
// // // // //         <GradeFormModal
// // // // //           grade={selectedGrade}
// // // // //           onClose={() => setIsModalOpen(false)}
// // // // //           onSaved={refetch}
// // // // //         />
// // // // //       )}
// // // // //     </div>
// // // // //     </Layout>
// // // // //   );
// // // // // };

// // // // // export default GradeManagement;


// // // // // components/GradeManagement.tsx
// // // // import React, { useState, useEffect } from 'react';
// // // // import { useAuth } from '../../context/AuthContext';
// // // // import type { AnyUser } from '../../types/user';
// // // // import toast from 'react-hot-toast';
// // // // import type { GradeFilterParams, GradeResponse } from '../../types/grade';
// // // // import { useDebounce } from '../../hooks/useDebounce';
// // // // import { userApi } from '../../api/users';
// // // // import { useGrades, useStudentGrades } from '../../hooks/useGrade';
// // // // import GradeFormModal from './GradeFormModel';

// // // // const PAGE_SIZE = 20;

// // // // const GradeManagement: React.FC = () => {
// // // //   const { user } = useAuth();
// // // //   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// // // //   const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// // // //   const isStudent = user?.role === 'STUDENT';
// // // //   const isParent = user?.role === 'PARENT';

// // // //   // Parent child selection state
// // // //   const [children, setChildren] = useState<AnyUser[]>([]);
// // // //   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
// // // //   const [loadingChildren, setLoadingChildren] = useState(false);

// // // //   // Filter state (for admin/teacher)
// // // //   const [filter, setFilter] = useState<GradeFilterParams>({});
// // // //   const debouncedFilter = useDebounce(filter, 300);
// // // //   const [page, setPage] = useState(0);
// // // //   const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // //   // Fetch children if user is a parent
// // // //   useEffect(() => {
// // // //     if (isParent && user) {
// // // //       setLoadingChildren(true);
// // // //       userApi.getChildren(user.id) // 👈 you need to implement this method in userApi
// // // //         .then(res => {
// // // //           setChildren(res.data);
// // // //           if (res.data.length > 0) {
// // // //             setSelectedChildId(res.data[0].id); // auto-select first child
// // // //           }
// // // //         })
// // // //         .catch(() => toast.error('Failed to load children'))
// // // //         .finally(() => setLoadingChildren(false));
// // // //     }
// // // //   }, [isParent, user]);

// // // //   // Determine which query to use
// // // //   const studentId = isStudent ? user!.id : (isParent ? selectedChildId : undefined);
// // // //   const useStudentQuery = (isStudent || isParent) && !!studentId;

// // // //   const {
// // // //     data: gradesData,
// // // //     isLoading,
// // // //     isError,
// // // //     error,
// // // //     refetch,
// // // //   } = useStudentQuery
// // // //     ? useStudentGrades(studentId!, page, true)
// // // //     : useGrades(debouncedFilter, page, canViewAll && !!filter.classId && !!filter.date);

// // // //   // Handle filter changes (for admin/teacher)
// // // //   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const { name, value } = e.target;
// // // //     setFilter((prev) => ({
// // // //       ...prev,
// // // //       [name]: value ? Number(value) : undefined,
// // // //     }));
// // // //     setPage(0);
// // // //   };

// // // //   // Handle delete
// // // //   const handleDelete = async (id: number) => {
// // // //     if (!window.confirm('Are you sure you want to delete this grade?')) return;
// // // //     try {
// // // //       await deleteMutation.mutateAsync(id);
// // // //       if (gradesData?.content.length === 1 && page > 0) {
// // // //         setPage(p => p - 1);
// // // //       }
// // // //     } catch (error) {
// // // //       // error toast handled by mutation
// // // //     }
// // // //   };

// // // //   const openModalForCreate = () => {
// // // //     setSelectedGrade(null);
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const openModalForEdit = (grade: GradeResponse) => {
// // // //     setSelectedGrade(grade);
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const totalPages = gradesData?.totalPages || 0;
// // // //   const canNext = page < totalPages - 1;
// // // //   const canPrev = page > 0;

// // // //   // If parent and no children, show appropriate message
// // // //   if (isParent && !loadingChildren && children.length === 0) {
// // // //     return (
// // // //       <div className="p-6 text-center text-gray-500">
// // // //         No children linked to your account.
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="p-6">
// // // //       <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

// // // //       {/* Parent child selector */}
// // // //       {isParent && (
// // // //         <div className="mb-4">
// // // //           <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
// // // //             Select Child
// // // //           </label>
// // // //           <select
// // // //             id="childSelect"
// // // //             value={selectedChildId ?? ''}
// // // //             onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
// // // //             className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // // //           >
// // // //             <option value="">-- Choose a child --</option>
// // // //             {children.map(child => (
// // // //               <option key={child.id} value={child.id}>
// // // //                 {child.firstName} {child.lastName}
// // // //               </option>
// // // //             ))}
// // // //           </select>
// // // //         </div>
// // // //       )}

// // // //       {/* Admin/Teacher filters */}
// // // //       {canViewAll && (
// // // //         <div className="flex gap-2 mb-4">
// // // //           <input
// // // //             type="number"
// // // //             name="classId"
// // // //             placeholder="Class ID"
// // // //             value={filter.classId ?? ''}
// // // //             onChange={handleFilterChange}
// // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // // //           />
// // // //           <input
// // // //             type="number"
// // // //             name="subjectId"
// // // //             placeholder="Subject ID"
// // // //             value={filter.subjectId ?? ''}
// // // //             onChange={handleFilterChange}
// // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // // //           />
// // // //           <input
// // // //             type="number"
// // // //             name="studentId"
// // // //             placeholder="Student ID"
// // // //             value={filter.studentId ?? ''}
// // // //             onChange={handleFilterChange}
// // // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // // //           />
// // // //         </div>
// // // //       )}

// // // //       {/* Create button for teachers/admins */}
// // // //       {canManage && (
// // // //         <button
// // // //           onClick={openModalForCreate}
// // // //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //         >
// // // //           Add Grade
// // // //         </button>
// // // //       )}

// // // //       {/* Loading & Error States */}
// // // //       {(isLoading || (isParent && loadingChildren)) && (
// // // //         <div className="text-center py-8 text-gray-500">Loading...</div>
// // // //       )}

// // // //       {isError && (
// // // //         <div className="text-center py-8 text-red-600">
// // // //           Failed to load grades. Please try again.
// // // //         </div>
// // // //       )}

// // // //       {/* No data */}
// // // //       {!isLoading && gradesData?.content.length === 0 && (
// // // //         <div className="text-center py-8 text-gray-500">No grades found.</div>
// // // //       )}

// // // //       {/* Grades Table */}
// // // //       {!isLoading && gradesData && gradesData.content.length > 0 && (
// // // //         <>
// // // //           <div className="overflow-x-auto bg-white rounded-lg shadow">
// // // //             <table className="min-w-full divide-y divide-gray-200">
// // // //               <thead className="bg-gray-50">
// // // //                 <tr>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
// // // //                   {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="bg-white divide-y divide-gray-200">
// // // //                 {gradesData.content.map((g) => (
// // // //                   <tr key={g.id} className="hover:bg-gray-50">
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // // //                       {new Date(g.examDate).toLocaleDateString()}
// // // //                     </td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // // //                       {g.marksObtained} / {g.maxMarks}
// // // //                     </td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
// // // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
// // // //                     {canManage && (
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
// // // //                         <button
// // // //                           onClick={() => openModalForEdit(g)}
// // // //                           className="text-indigo-600 hover:text-indigo-900"
// // // //                         >
// // // //                           Edit
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleDelete(g.id)}
// // // //                           className="text-red-600 hover:text-red-900"
// // // //                         >
// // // //                           Delete
// // // //                         </button>
// // // //                       </td>
// // // //                     )}
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>

// // // //           {/* Pagination */}
// // // //           <div className="flex items-center justify-center gap-4 mt-4">
// // // //             <button
// // // //               onClick={() => setPage(p => p - 1)}
// // // //               disabled={!canPrev}
// // // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // // //             >
// // // //               Previous
// // // //             </button>
// // // //             <span className="text-sm text-gray-700">
// // // //               Page {page + 1} of {totalPages}
// // // //             </span>
// // // //             <button
// // // //               onClick={() => setPage(p => p + 1)}
// // // //               disabled={!canNext}
// // // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // // //             >
// // // //               Next
// // // //             </button>
// // // //           </div>
// // // //         </>
// // // //       )}

// // // //       {/* Grade Form Modal */}
// // // //       {isModalOpen && (
// // // //         <GradeFormModal
// // // //           grade={selectedGrade}
// // // //           onClose={() => setIsModalOpen(false)}
// // // //           onSaved={refetch}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default GradeManagement;

// // // import React, { useState, useEffect } from 'react';
// // // import { useAuth } from '../../context/AuthContext';
// // // import type { AnyUser } from '../../types/user';
// // // import toast from 'react-hot-toast';
// // // import type { GradeFilterParams, GradeResponse } from '../../types/grade';
// // // import { useDebounce } from '../../hooks/useDebounce';
// // // import { userApi } from '../../api/users';
// // // import { useGrades, useStudentGrades, useDeleteGrade } from '../../hooks/useGrade'; // import delete hook
// // // import GradeFormModal from './GradeFormModel';

// // // const PAGE_SIZE = 20;

// // // const GradeManagement: React.FC = () => {
// // //   const { user } = useAuth();
// // //   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// // //   const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// // //   const isStudent = user?.role === 'STUDENT';
// // //   const isParent = user?.role === 'PARENT';

// // //   // Parent child selection state (if endpoint exists)
// // //   const [children, setChildren] = useState<AnyUser[]>([]);
// // //   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
// // //   const [loadingChildren, setLoadingChildren] = useState(false);

// // //   // Filter state (for admin/teacher)
// // //   const [filter, setFilter] = useState<GradeFilterParams>({});
// // //   const debouncedFilter = useDebounce(filter, 300);
// // //   const [page, setPage] = useState(0);
// // //   const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // //   // Delete mutation
// // //   const deleteMutation = useDeleteGrade();

// // //   // Fetch children if user is a parent (if endpoint exists)
// // //   useEffect(() => {
// // //     if (isParent && user) {
// // //       setLoadingChildren(true);
// // //       // Check if getChildren exists; if not, we'll handle gracefully
// // //       if (userApi.getChildren) {
// // //         userApi.getChildren(user.id)
// // //           .then((res: any) => {
// // //             setChildren(res.data);
// // //             if (res.data.length > 0) {
// // //               setSelectedChildId(res.data[0].id);
// // //             }
// // //           })
// // //           .catch(() => toast.error('Failed to load children'))
// // //           .finally(() => setLoadingChildren(false));
// // //       } else {
// // //         // getChildren not implemented, show message
// // //         setLoadingChildren(false);
// // //         toast.error('Children endpoint not available');
// // //       }
// // //     }
// // //   }, [isParent, user]);

// // //   // Determine which query to use
// // //   const studentId = isStudent ? user!.id : (isParent ? selectedChildId : undefined);
// // //   const useStudentQuery = (isStudent || isParent) && !!studentId;

// // //   const {
// // //     data: gradesData,
// // //     isLoading,
// // //     isError,
// // //     error,
// // //     refetch,
// // //   } = useStudentQuery
// // //     ? useStudentGrades(studentId!, page, true)
// // //     : useGrades(debouncedFilter, page, canViewAll); // no filter.date requirement

// // //   // Handle filter changes (for admin/teacher)
// // //   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, value } = e.target;
// // //     setFilter((prev) => ({
// // //       ...prev,
// // //       [name]: value ? Number(value) : undefined,
// // //     }));
// // //     setPage(0);
// // //   };

// // //   // Handle delete
// // //   const handleDelete = async (id: number) => {
// // //     if (!window.confirm('Are you sure you want to delete this grade?')) return;
// // //     try {
// // //       await deleteMutation.mutateAsync(id);
// // //       if (gradesData?.content.length === 1 && page > 0) {
// // //         setPage(p => p - 1);
// // //       }
// // //     } catch (error) {
// // //       // error toast handled by mutation
// // //     }
// // //   };

// // //   const openModalForCreate = () => {
// // //     setSelectedGrade(null);
// // //     setIsModalOpen(true);
// // //   };

// // //   const openModalForEdit = (grade: GradeResponse) => {
// // //     setSelectedGrade(grade);
// // //     setIsModalOpen(true);
// // //   };

// // //   const totalPages = gradesData?.totalPages || 0;
// // //   const canNext = page < totalPages - 1;
// // //   const canPrev = page > 0;

// // //   // If parent and no children, show appropriate message
// // //   if (isParent && !loadingChildren && children.length === 0) {
// // //     return (
// // //       <div className="p-6 text-center text-gray-500">
// // //         No children linked to your account.
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

// // //       {/* Parent child selector (only if children exist) */}
// // //       {isParent && children.length > 0 && (
// // //         <div className="mb-4">
// // //           <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
// // //             Select Child
// // //           </label>
// // //           <select
// // //             id="childSelect"
// // //             value={selectedChildId ?? ''}
// // //             onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
// // //             className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //           >
// // //             <option value="">-- Choose a child --</option>
// // //             {children.map(child => (
// // //               <option key={child.id} value={child.id}>
// // //                 {child.firstName} {child.lastName}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //       )}

// // //       {/* Admin/Teacher filters */}
// // //       {canViewAll && (
// // //         <div className="flex gap-2 mb-4">
// // //           <input
// // //             type="number"
// // //             name="classId"
// // //             placeholder="Class ID"
// // //             value={filter.classId ?? ''}
// // //             onChange={handleFilterChange}
// // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //           />
// // //           <input
// // //             type="number"
// // //             name="subjectId"
// // //             placeholder="Subject ID"
// // //             value={filter.subjectId ?? ''}
// // //             onChange={handleFilterChange}
// // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //           />
// // //           <input
// // //             type="number"
// // //             name="studentId"
// // //             placeholder="Student ID"
// // //             value={filter.studentId ?? ''}
// // //             onChange={handleFilterChange}
// // //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //           />
// // //         </div>
// // //       )}

// // //       {/* Create button for teachers/admins */}
// // //       {canManage && (
// // //         <button
// // //           onClick={openModalForCreate}
// // //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //         >
// // //           Add Grade
// // //         </button>
// // //       )}

// // //       {/* Loading & Error States */}
// // //       {(isLoading || (isParent && loadingChildren)) && (
// // //         <div className="text-center py-8 text-gray-500">Loading...</div>
// // //       )}

// // //       {isError && (
// // //         <div className="text-center py-8 text-red-600">
// // //           Failed to load grades. Please try again.
// // //         </div>
// // //       )}

// // //       {/* No data */}
// // //       {!isLoading && gradesData?.content.length === 0 && (
// // //         <div className="text-center py-8 text-gray-500">No grades found.</div>
// // //       )}

// // //       {/* Grades Table */}
// // //       {!isLoading && gradesData && gradesData.content.length > 0 && (
// // //         <>
// // //           <div className="overflow-x-auto bg-white rounded-lg shadow">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
// // //                   {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="bg-white divide-y divide-gray-200">
// // //                 {gradesData.content.map((g) => (
// // //                   <tr key={g.id} className="hover:bg-gray-50">
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                       {new Date(g.examDate).toLocaleDateString()}
// // //                     </td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                       {g.marksObtained} / {g.maxMarks}
// // //                     </td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
// // //                     {canManage && (
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
// // //                         <button
// // //                           onClick={() => openModalForEdit(g)}
// // //                           className="text-indigo-600 hover:text-indigo-900"
// // //                         >
// // //                           Edit
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDelete(g.id)}
// // //                           className="text-red-600 hover:text-red-900"
// // //                         >
// // //                           Delete
// // //                         </button>
// // //                       </td>
// // //                     )}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Pagination */}
// // //           <div className="flex items-center justify-center gap-4 mt-4">
// // //             <button
// // //               onClick={() => setPage(p => p - 1)}
// // //               disabled={!canPrev}
// // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // //             >
// // //               Previous
// // //             </button>
// // //             <span className="text-sm text-gray-700">
// // //               Page {page + 1} of {totalPages}
// // //             </span>
// // //             <button
// // //               onClick={() => setPage(p => p + 1)}
// // //               disabled={!canNext}
// // //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// // //             >
// // //               Next
// // //             </button>
// // //           </div>
// // //         </>
// // //       )}

// // //       {/* Grade Form Modal */}
// // //       {isModalOpen && (
// // //         <GradeFormModal
// // //           grade={selectedGrade}
// // //           onClose={() => setIsModalOpen(false)}
// // //           onSaved={refetch}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default GradeManagement;

// // import React, { useState, useEffect } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // import type { AnyUser } from '../../types/user';
// // import toast from 'react-hot-toast';
// // import type { GradeFilterParams, GradeResponse } from '../../types/grade';
// // import { useDebounce } from '../../hooks/useDebounce';
// // import { userApi } from '../../api/users';
// // import { useGrades, useStudentGrades, useDeleteGrade } from '../../hooks/useGrade';
// // import GradeFormModal from './GradeFormModel';

// // const PAGE_SIZE = 20;

// // const GradeManagement: React.FC = () => {
// //   const { user } = useAuth();
// //   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// //   const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';
// //   const isStudent = user?.role === 'STUDENT';
// //   const isParent = user?.role === 'PARENT';

// //   // Parent child selection state (if endpoint exists)
// //   const [children, setChildren] = useState<AnyUser[]>([]);
// //   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
// //   const [loadingChildren, setLoadingChildren] = useState(false);

// //   // Filter state (for admin/teacher)
// //   const [filter, setFilter] = useState<GradeFilterParams>({});
// //   const debouncedFilter = useDebounce(filter, 300);
// //   const [page, setPage] = useState(0);
// //   const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   // Delete mutation
// //   const deleteMutation = useDeleteGrade();

// //   // Fetch children if user is a parent (if endpoint exists)
// //   // useEffect(() => {
// //   //   if (isParent && user) {
// //   //     setLoadingChildren(true);
// //   //     // Check if getChildren exists; use type assertion to avoid TS error
// //   //     const api = userApi as any;
// //   //     if (api.getChildren) {
// //   //       api.getChildren(user.id)
// //   //         .then((res: { data: AnyUser[] }) => {
// //   //           setChildren(res.data);
// //   //           if (res.data.length > 0) {
// //   //             setSelectedChildId(res.data[0].id);
// //   //           }
// //   //         })
// //   //         .catch(() => toast.error('Failed to load children'))
// //   //         .finally(() => setLoadingChildren(false));
// //   //     } else {
// //   //       // getChildren not implemented, show message
// //   //       setLoadingChildren(false);
// //   //       toast.error('Children endpoint not available');
// //   //     }
// //   //   }
// //   // }, [isParent, user]);

// //   useEffect(() => {
// //   if (isParent && user) {
// //     setLoadingChildren(true);
// //     userApi.getChildren(user.id, 0, 100)
// //       .then((res) => {
// //         setChildren(res.data.content);
// //         if (res.data.content.length > 0) {
// //           setSelectedChildId(res.data.content[0].id);
// //         }
// //       })
// //       .catch(() => {
// //         toast.error('Failed to load children');
// //         setChildren([]);
// //       })
// //       .finally(() => setLoadingChildren(false));
// //   }
// // }, [isParent, user]);

// //   // Determine which query to use
// //   const studentId = isStudent ? user!.id : (isParent ? selectedChildId : undefined);
// //   const useStudentQuery = (isStudent || isParent) && !!studentId;

// //   const {
// //     data: gradesData,
// //     isLoading,
// //     isError,
// //     error,
// //     refetch,
// //   } = useStudentQuery
// //     ? useStudentGrades(studentId!, page, true)
// //     : useGrades(debouncedFilter, page, canViewAll); // removed date check

// //   // Handle filter changes (for admin/teacher)
// //   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setFilter((prev) => ({
// //       ...prev,
// //       [name]: value ? Number(value) : undefined,
// //     }));
// //     setPage(0);
// //   };

// //   // Handle delete
// //   const handleDelete = async (id: number) => {
// //     if (!window.confirm('Are you sure you want to delete this grade?')) return;
// //     try {
// //       await deleteMutation.mutateAsync(id);
// //       if (gradesData?.content.length === 1 && page > 0) {
// //         setPage(p => p - 1);
// //       }
// //     } catch (error) {
// //       // error toast handled by mutation
// //     }
// //   };

// //   const openModalForCreate = () => {
// //     setSelectedGrade(null);
// //     setIsModalOpen(true);
// //   };

// //   const openModalForEdit = (grade: GradeResponse) => {
// //     setSelectedGrade(grade);
// //     setIsModalOpen(true);
// //   };

// //   const totalPages = gradesData?.totalPages || 0;
// //   const canNext = page < totalPages - 1;
// //   const canPrev = page > 0;

// //   // If parent and no children, show appropriate message
// //   if (isParent && !loadingChildren && children.length === 0) {
// //     return (
// //       <div className="p-6 text-center text-gray-500">
// //         No children linked to your account.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

// //       {/* Parent child selector (only if children exist) */}
// //       {isParent && children.length > 0 && (
// //         <div className="mb-4">
// //           <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
// //             Select Child
// //           </label>
// //           <select
// //             id="childSelect"
// //             value={selectedChildId ?? ''}
// //             onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
// //             className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //           >
// //             <option value="">-- Choose a child --</option>
// //             {children.map(child => (
// //               <option key={child.id} value={child.id}>
// //                 {child.firstName} {child.lastName}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}

// //       {/* Admin/Teacher filters */}
// //       {canViewAll && (
// //         <div className="flex gap-2 mb-4">
// //           <input
// //             type="number"
// //             name="classId"
// //             placeholder="Class ID"
// //             value={filter.classId ?? ''}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //           />
// //           <input
// //             type="number"
// //             name="subjectId"
// //             placeholder="Subject ID"
// //             value={filter.subjectId ?? ''}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //           />
// //           <input
// //             type="number"
// //             name="studentId"
// //             placeholder="Student ID"
// //             value={filter.studentId ?? ''}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //           />
// //         </div>
// //       )}

// //       {/* Create button for teachers/admins */}
// //       {canManage && (
// //         <button
// //           onClick={openModalForCreate}
// //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //         >
// //           Add Grade
// //         </button>
// //       )}

// //       {/* Loading & Error States */}
// //       {(isLoading || (isParent && loadingChildren)) && (
// //         <div className="text-center py-8 text-gray-500">Loading...</div>
// //       )}

// //       {isError && (
// //         <div className="text-center py-8 text-red-600">
// //           Failed to load grades. Please try again.
// //         </div>
// //       )}

// //       {/* No data */}
// //       {!isLoading && gradesData?.content.length === 0 && (
// //         <div className="text-center py-8 text-gray-500">No grades found.</div>
// //       )}

// //       {/* Grades Table */}
// //       {!isLoading && gradesData && gradesData.content.length > 0 && (
// //         <>
// //           <div className="overflow-x-auto bg-white rounded-lg shadow">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
// //                   {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {gradesData.content.map((g) => (
// //                   <tr key={g.id} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                       {new Date(g.examDate).toLocaleDateString()}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                       {g.marksObtained} / {g.maxMarks}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
// //                     {canManage && (
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
// //                         <button
// //                           onClick={() => openModalForEdit(g)}
// //                           className="text-indigo-600 hover:text-indigo-900"
// //                         >
// //                           Edit
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(g.id)}
// //                           className="text-red-600 hover:text-red-900"
// //                         >
// //                           Delete
// //                         </button>
// //                       </td>
// //                     )}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="flex items-center justify-center gap-4 mt-4">
// //             <button
// //               onClick={() => setPage(p => p - 1)}
// //               disabled={!canPrev}
// //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //             >
// //               Previous
// //             </button>
// //             <span className="text-sm text-gray-700">
// //               Page {page + 1} of {totalPages}
// //             </span>
// //             <button
// //               onClick={() => setPage(p => p + 1)}
// //               disabled={!canNext}
// //               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </>
// //       )}

// //       {/* Grade Form Modal */}
// //       {isModalOpen && (
// //         <GradeFormModal
// //           grade={selectedGrade}
// //           onClose={() => setIsModalOpen(false)}
// //           onSaved={refetch}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default GradeManagement;


// // components/GradeManagement.tsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useGrades, useStudentGrades, useDeleteGrade } from '../../hooks/useGrade';
// import { userApi } from '../../api/users';
// import { useDebounce } from '../../hooks/useDebounce';
// // import GradeFormModal from './GradeFormModal';
// import type { GradeFilterParams, GradeResponse } from '../../types/grade';
// import type { AnyUser } from '../../types/user';
// import toast from 'react-hot-toast';
// import GradeFormModal from './GradeFormModel';

// const PAGE_SIZE = 20;

// const GradeManagement: React.FC = () => {
//   const { user } = useAuth();
//   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
//   const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';
//   const isStudent = user?.role === 'STUDENT';
//   const isParent = user?.role === 'PARENT';

//   // Parent child selection
//   const [children, setChildren] = useState<AnyUser[]>([]);
//   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
//   const [loadingChildren, setLoadingChildren] = useState(false);

//   // Filter state (for admin/teacher)
//   const [filter, setFilter] = useState<GradeFilterParams>({});
//   const debouncedFilter = useDebounce(filter, 300);

//   // Pagination
//   const [page, setPage] = useState(0);

//   // Modal state
//   const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Delete mutation
//   const deleteMutation = useDeleteGrade();

//   // Fetch children if parent
//   useEffect(() => {
//     if (isParent && user) {
//       setLoadingChildren(true);
//       userApi.getChildren(user.id, 0, 100)
//         .then((res) => {
//           setChildren(res.data.content);
//           if (res.data.content.length > 0) {
//             setSelectedChildId(res.data.content[0].id);
//           }
//         })
//         .catch(() => {
//           toast.error('Failed to load children');
//           setChildren([]);
//         })
//         .finally(() => setLoadingChildren(false));
//     }
//   }, [isParent, user]);

//   // Determine which query to use
//   const studentId = isStudent ? user!.id : (isParent ? selectedChildId : undefined);
//   const useStudentQuery = (isStudent || isParent) && !!studentId;

//   const {
//     data: gradesData,
//     isLoading,
//     isError,
//     refetch,
//   } = useStudentQuery
//     ? useStudentGrades(studentId!, page, true)
//     : useGrades(debouncedFilter, page, canViewAll);

//   // Handlers
//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({
//       ...prev,
//       [name]: value ? Number(value) : undefined,
//     }));
//     setPage(0);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this grade?')) return;
//     try {
//       await deleteMutation.mutateAsync(id);
//       if (gradesData?.content.length === 1 && page > 0) {
//         setPage((p) => p - 1);
//       }
//     } catch (error) {
//       // error toast handled by mutation
//     }
//   };

//   const openModalForCreate = () => {
//     setSelectedGrade(null);
//     setIsModalOpen(true);
//   };

//   const openModalForEdit = (grade: GradeResponse) => {
//     setSelectedGrade(grade);
//     setIsModalOpen(true);
//   };

//   const totalPages = gradesData?.totalPages || 0;
//   const canNext = page < totalPages - 1;
//   const canPrev = page > 0;

//   // Parent with no children
//   if (isParent && !loadingChildren && children.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No children linked to your account.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

//       {/* Parent child selector */}
//       {isParent && children.length > 0 && (
//         <div className="mb-4">
//           <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
//             Select Child
//           </label>
//           <select
//             id="childSelect"
//             value={selectedChildId ?? ''}
//             onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
//             className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">-- Choose a child --</option>
//             {children.map((child) => (
//               <option key={child.id} value={child.id}>
//                 {child.firstName} {child.lastName}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Admin/Teacher filters */}
//       {canViewAll && (
//         <div className="flex gap-2 mb-4">
//           <input
//             type="number"
//             name="classId"
//             placeholder="Class ID"
//             value={filter.classId ?? ''}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//           <input
//             type="number"
//             name="subjectId"
//             placeholder="Subject ID"
//             value={filter.subjectId ?? ''}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//           <input
//             type="number"
//             name="studentId"
//             placeholder="Student ID"
//             value={filter.studentId ?? ''}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//       )}

//       {/* Create button */}
//       {canManage && (
//         <button
//           onClick={openModalForCreate}
//           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Add Grade
//         </button>
//       )}

//       {/* Loading state */}
//       {(isLoading || (isParent && loadingChildren)) && (
//         <div className="text-center py-8 text-gray-500">Loading...</div>
//       )}

//       {/* Error state */}
//       {isError && (
//         <div className="text-center py-8 text-red-600">
//           Failed to load grades. Please try again.
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && gradesData?.content.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No grades found.</div>
//       )}

//       {/* Grades Table */}
//       {!isLoading && gradesData && gradesData.content.length > 0 && (
//         <>
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
//                   {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {gradesData.content.map((g) => (
//                   <tr key={g.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(g.examDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {g.marksObtained} / {g.maxMarks}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
//                     {canManage && (
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                         <button
//                           onClick={() => openModalForEdit(g)}
//                           className="text-indigo-600 hover:text-indigo-900"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(g.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-center gap-4 mt-4">
//             <button
//               onClick={() => setPage((p) => p - 1)}
//               disabled={!canPrev}
//               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-700">
//               Page {page + 1} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((p) => p + 1)}
//               disabled={!canNext}
//               className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}

//       {/* Create/Edit Modal */}
//       {isModalOpen && (
//         <GradeFormModal
//           grade={selectedGrade}
//           onClose={() => setIsModalOpen(false)}
//           onSaved={refetch}
//         />
//       )}
//     </div>
//   );
// };

// export default GradeManagement;

// components/GradeManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGrades, useStudentGrades, useDeleteGrade } from '../../hooks/useGrade';
import { userApi } from '../../api/users';
import { useDebounce } from '../../hooks/useDebounce';
// import GradeFormModal from './GradeFormModal';
import type { GradeFilterParams, GradeResponse } from '../../types/grade';
import type { AnyUser } from '../../types/user';
import toast from 'react-hot-toast';
import GradeFormModal from './GradeFormModel';
import Layout from '../../component/layout';

const PAGE_SIZE = 20;

const GradeManagement: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const canViewAll = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  // Parent child selection
  const [children, setChildren] = useState<AnyUser[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(false);

  // Filter state (for admin/teacher)
  const [filter, setFilter] = useState<GradeFilterParams>({});
  const debouncedFilter = useDebounce(filter, 300);

  // Pagination
  const [page, setPage] = useState(0);

  // Modal state
  const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete mutation
  const deleteMutation = useDeleteGrade();

  // Fetch children if parent
  useEffect(() => {
    if (isParent && user) {
      setLoadingChildren(true);
      userApi.getChildren(user.id, 0, 100)
        .then((res) => {
          setChildren(res.data.content);
          if (res.data.content.length > 0) {
            setSelectedChildId(res.data.content[0].id);
          }
        })
        .catch(() => {
          toast.error('Failed to load children');
          setChildren([]);
        })
        .finally(() => setLoadingChildren(false));
    }
  }, [isParent, user]);

  // Determine which query to use
  const studentId = isStudent ? user!.id : (isParent ? selectedChildId : undefined);
  const useStudentQuery = (isStudent || isParent) && !!studentId;

  const {
    data: gradesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentQuery
    ? useStudentGrades(studentId!, page, true)
    : useGrades(debouncedFilter, page, canViewAll);

  // Log error details (optional)
  useEffect(() => {
    if (isError) {
      console.error('Grade fetch error:', error);
    }
  }, [isError, error]);

  // Handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value ? Number(value) : undefined,
    }));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (gradesData?.content.length === 1 && page > 0) {
        setPage((p) => p - 1);
      }
    } catch (error) {
      // error toast handled by mutation
    }
  };

  const openModalForCreate = () => {
    setSelectedGrade(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (grade: GradeResponse) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const totalPages = gradesData?.totalPages || 0;
  const canNext = page < totalPages - 1;
  const canPrev = page > 0;

  // Parent with no children
  if (isParent && !loadingChildren && children.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No children linked to your account.
      </div>
    );
  }

  return (
    <Layout>
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Grade Management</h2>

      {/* Parent child selector */}
      {isParent && children.length > 0 && (
        <div className="mb-4">
          <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700">
            Select Child
          </label>
          <select
            id="childSelect"
            value={selectedChildId ?? ''}
            onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
            className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose a child --</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Admin/Teacher filters */}
      {canViewAll && (
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            name="classId"
            placeholder="Class ID"
            value={filter.classId ?? ''}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="subjectId"
            placeholder="Subject ID"
            value={filter.subjectId ?? ''}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="studentId"
            placeholder="Student ID"
            value={filter.studentId ?? ''}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Create button */}
      {canManage && (
        <button
          onClick={openModalForCreate}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Grade
        </button>
      )}

      {/* Loading state */}
      {(isLoading || (isParent && loadingChildren)) && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center py-8 text-red-600">
          Failed to load grades. Please try again later. If the problem persists, contact support.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && gradesData?.content.length === 0 && (
        <div className="text-center py-8 text-gray-500">No grades found.</div>
      )}

      {/* Grades Table */}
      {!isLoading && !isError && gradesData && gradesData.content.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered By</th>
                  {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradesData.content.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.subjectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.className}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.examName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(g.examDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {g.marksObtained} / {g.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.gradeLetter}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.remarks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.enteredBy}</td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openModalForEdit(g)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!canPrev}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <GradeFormModal
          grade={selectedGrade}
          onClose={() => setIsModalOpen(false)}
          onSaved={refetch}
        />
      )}
    </div>
    </Layout>
  );
};

export default GradeManagement;