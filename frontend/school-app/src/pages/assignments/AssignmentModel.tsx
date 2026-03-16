// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useAssignments, useDeleteAssignment } from '../../hooks/useAssignments';
// import { useChildren } from '../../hooks/useChildren';
// import { classService } from '../../api/class';
// import AssignmentFormModal from './AssignmentForm';
// import AssignmentDetailModal from './AssignmentDetailsModel';
// import Layout from '../../component/layout';
// import toast from 'react-hot-toast';
// import type { ClassRoomResponse } from '../../types/class';

// const PAGE_SIZE = 10;

// const AssignmentManagement: React.FC = () => {
//   const { user } = useAuth();
//   const isTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER';
//   const isStudent = user?.role === 'STUDENT';
//   const isParent = user?.role === 'PARENT';

//   const [filterClassId, setFilterClassId] = useState<number | undefined>(undefined);
//   const [page, setPage] = useState(0);
//   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
//   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

//   // For modals
//   const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//   const deleteMutation = useDeleteAssignment();

//   // Fetch children if user is parent
//   const { data: childrenData, isLoading: loadingChildren } = useChildren(
//     isParent ? user!.id : undefined,
//     isParent
//   );
//   const children = childrenData?.content || [];

//   // Auto-select first child for parents
//   useEffect(() => {
//     if (isParent && children.length > 0 && selectedChildId === null) {
//       setSelectedChildId(children[0].id);
//     }
//   }, [isParent, children, selectedChildId]);

//   // Load classes for filter (if teacher)
//   useEffect(() => {
//     if (isTeacher) {
//       classService.getAll(0, 100)
//         .then((res) => setClasses(res.data.content))
//         .catch(() => toast.error('Failed to load classes'));
//     }
//   }, [isTeacher]);

//   // Determine studentId based on role
//   const studentId = isStudent 
//   ? user!.id 
//   : isParent 
//     ? (selectedChildId ?? undefined)   // convert null → undefined
//     : undefined;

//   const { data, isLoading, isError, refetch } = useAssignments(
//     filterClassId,
//     studentId,
//     page
//   );

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this assignment?')) return;
//     try {
//       await deleteMutation.mutateAsync(id);
//       if (data?.content.length === 1 && page > 0) setPage(p => p - 1);
//     } catch (error) {
//       // error toast handled
//     }
//   };

//   const openCreateModal = () => {
//     setSelectedAssignmentId(null);
//     setIsFormModalOpen(true);
//   };

//   const openEditModal = (id: number) => {
//     setSelectedAssignmentId(id);
//     setIsFormModalOpen(true);
//   };

//   const openDetailModal = (id: number) => {
//     setSelectedAssignmentId(id);
//     setIsDetailModalOpen(true);
//   };

//   const handleModalSaved = () => {
//     refetch();
//   };

//   const totalPages = data?.totalPages || 0;

//   // Render child selector for parent
//   const renderChildSelector = () => {
//     if (!isParent) return null;
//     if (loadingChildren) return <div className="text-gray-500">Loading children...</div>;
//     if (children.length === 0) return <div className="text-gray-500">No children linked to your account.</div>;
//     if (children.length === 1) {
//       return (
//         <div className="mb-4">
//           <span className="text-sm font-medium text-gray-700">Viewing assignments for: </span>
//           <span className="text-sm text-gray-900">{children[0].firstName} {children[0].lastName}</span>
//         </div>
//       );
//     }
//     return (
//       <div className="mb-4">
//         <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
//           Select Child
//         </label>
//         <select
//           id="child"
//           value={selectedChildId ?? ''}
//           onChange={(e) => setSelectedChildId(Number(e.target.value))}
//           className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//         >
//           {children.map((child) => (
//             <option key={child.id} value={child.id}>
//               {child.firstName} {child.lastName}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h2 className="text-2xl font-semibold mb-4">Assignments</h2>

//         {/* Teacher Controls */}
//         {isTeacher && (
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex gap-2">
//               <select
//                 value={filterClassId ?? ''}
//                 onChange={(e) => setFilterClassId(e.target.value ? Number(e.target.value) : undefined)}
//                 className="px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">All Classes</option>
//                 {classes.map((c) => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//             </div>
//             <button
//               onClick={openCreateModal}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Create Assignment
//             </button>
//           </div>
//         )}

//         {/* Parent Child Selector */}
//         {renderChildSelector()}

//         {/* Student/Parent status message */}
//         {(isStudent || isParent) && (
//           <p className="mb-4 text-gray-600">
//             {isStudent ? 'Your assignments:' : 'Assignments for your child:'}
//           </p>
//         )}

//         {/* Loading / Error / Empty states */}
//         {isLoading && <div className="text-center py-8">Loading...</div>}
//         {isError && <div className="text-center py-8 text-red-600">Failed to load assignments.</div>}
//         {data && data.content.length === 0 && (
//           <div className="text-center py-8 text-gray-500">No assignments found.</div>
//         )}

//         {/* Assignment Cards */}
//         {data && data.content.length > 0 && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {data.content.map((assignment) => (
//                 <div key={assignment.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                   <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
//                   <p className="text-sm text-gray-600 mb-1">Class: {assignment.className}</p>
//                   <p className="text-sm text-gray-600 mb-1">Subject: {assignment.subjectName}</p>
//                   <p className="text-sm text-gray-600 mb-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
//                   <div className="flex justify-between items-center">
//                     <button
//                       onClick={() => openDetailModal(assignment.id)}
//                       className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                       View Details
//                     </button>
//                     {isTeacher && (
//                       <div className="space-x-2">
//                         <button
//                           onClick={() => openEditModal(assignment.id)}
//                           className="text-indigo-600 hover:text-indigo-800 text-sm"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(assignment.id)}
//                           className="text-red-600 hover:text-red-800 text-sm"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-center gap-4 mt-6">
//               <button
//                 onClick={() => setPage(p => p - 1)}
//                 disabled={page === 0}
//                 className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-700">Page {page + 1} of {totalPages}</span>
//               <button
//                 onClick={() => setPage(p => p + 1)}
//                 disabled={page >= totalPages - 1}
//                 className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}

//         {/* Form Modal */}
//         {isFormModalOpen && (
//           <AssignmentFormModal
//             assignment={selectedAssignmentId ? data?.content.find(a => a.id === selectedAssignmentId) : undefined}
//             onClose={() => setIsFormModalOpen(false)}
//             onSaved={handleModalSaved}
//           />
//         )}

//         {/* Detail Modal */}
//         {isDetailModalOpen && selectedAssignmentId && (
//           <AssignmentDetailModal
//             assignmentId={selectedAssignmentId}
//             onClose={() => setIsDetailModalOpen(false)}
//             onSaved={handleModalSaved}
//           />
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default AssignmentManagement;


// pages/AssignmentManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments, useDeleteAssignment, usePublishAssignment, useChildrenAssignments } from '../../hooks/useAssignments';
import { useChildren } from '../../hooks/useChildren';
import { classService } from '../../api/class';
// import AssignmentFormModal from '../components/AssignmentForm';
// import AssignmentDetailModal from '../components/AssignmentDetailsModel';
import Layout from '../../component/layout';
import toast from 'react-hot-toast';
import type { ClassRoomResponse } from '../../types/class';
import AssignmentFormModal from './AssignmentForm';
import AssignmentDetailModal from './AssignmentDetailsModel';

const PAGE_SIZE = 10;

const AssignmentManagement: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  const [filterClassId, setFilterClassId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // For modals
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const deleteMutation = useDeleteAssignment();
  const publishMutation = usePublishAssignment();

  // Fetch children if user is parent
  const { data: childrenData, isLoading: loadingChildren } = useChildren(
    isParent ? user!.id : undefined,
    isParent
  );
  const children = childrenData?.content || [];

  // Auto-select first child for parents
  useEffect(() => {
    if (isParent && children.length > 0 && selectedChildId === null) {
      setSelectedChildId(children[0].id);
    }
  }, [isParent, children, selectedChildId]);

  // Load classes for filter (if teacher)
  useEffect(() => {
    if (isTeacher) {
      classService.getAll(0, 100)
        .then((res) => setClasses(res.data.content))
        .catch(() => toast.error('Failed to load classes'));
    }
  }, [isTeacher]);

  // Determine which query to use
  let assignmentsQuery;
  if (isStudent) {
    assignmentsQuery = useAssignments(undefined, user!.id, page);
  } else if (isParent) {
    assignmentsQuery = useChildrenAssignments(user!.id, page);
  } else if (isTeacher) {
    assignmentsQuery = useAssignments(filterClassId, undefined, page);
  } else {
    assignmentsQuery = useAssignments(undefined, undefined, page);
  }

  const { data, isLoading, isError, refetch } = assignmentsQuery;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (data?.content.length === 1 && page > 0) setPage(p => p - 1);
    } catch (error) {
      // error toast handled
    }
  };

  const handlePublish = async (id: number) => {
    if (!window.confirm('Publish this assignment? Students will be able to see it.')) return;
    try {
      await publishMutation.mutateAsync(id);
    } catch (error) {
      // error handled
    }
  };

  const openCreateModal = () => {
    setSelectedAssignmentId(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setSelectedAssignmentId(id);
    setIsFormModalOpen(true);
  };

  const openDetailModal = (id: number) => {
    setSelectedAssignmentId(id);
    setIsDetailModalOpen(true);
  };

  const handleModalSaved = () => {
    refetch();
  };

  const totalPages = data?.totalPages || 0;

  // Render child selector for parent
  const renderChildSelector = () => {
    if (!isParent) return null;
    if (loadingChildren) return <div className="text-gray-500">Loading children...</div>;
    if (children.length === 0) return <div className="text-gray-500">No children linked to your account.</div>;
    if (children.length === 1) {
      return (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Viewing assignments for: </span>
          <span className="text-sm text-gray-900">{children[0].firstName} {children[0].lastName}</span>
        </div>
      );
    }
    return (
      <div className="mb-4">
        <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
          Select Child
        </label>
        <select
          id="child"
          value={selectedChildId ?? ''}
          onChange={(e) => setSelectedChildId(Number(e.target.value))}
          className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.firstName} {child.lastName}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Assignments</h2>

        {/* Teacher Controls */}
        {isTeacher && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <select
                value={filterClassId ?? ''}
                onChange={(e) => setFilterClassId(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Assignment
            </button>
          </div>
        )}

        {/* Parent Child Selector */}
        {renderChildSelector()}

        {/* Student/Parent status message */}
        {(isStudent || isParent) && (
          <p className="mb-4 text-gray-600">
            {isStudent ? 'Your assignments:' : 'Assignments for your child:'}
          </p>
        )}

        {/* Loading / Error / Empty states */}
        {isLoading && <div className="text-center py-8">Loading...</div>}
        {isError && <div className="text-center py-8 text-red-600">Failed to load assignments.</div>}
        {data && data.content.length === 0 && (
          <div className="text-center py-8 text-gray-500">No assignments found.</div>
        )}

        {/* Assignment Cards */}
        {data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.content.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      assignment.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Class: {assignment.className}</p>
                  <p className="text-sm text-gray-600 mb-1">Subject: {assignment.subjectName}</p>
                  <p className="text-sm text-gray-600 mb-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => openDetailModal(assignment.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {isTeacher && (
                      <div className="space-x-2">
                        {assignment.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(assignment.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(assignment.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Form Modal */}
        {isFormModalOpen && (
          <AssignmentFormModal
            assignment={selectedAssignmentId ? data?.content.find(a => a.id === selectedAssignmentId) : undefined}
            onClose={() => setIsFormModalOpen(false)}
            onSaved={handleModalSaved}
          />
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && selectedAssignmentId && (
          <AssignmentDetailModal
            assignmentId={selectedAssignmentId}
            onClose={() => setIsDetailModalOpen(false)}
            onSaved={handleModalSaved}
          />
        )}
      </div>
    </Layout>
  );
};

export default AssignmentManagement;