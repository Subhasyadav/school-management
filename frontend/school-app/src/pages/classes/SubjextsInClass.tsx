// // import React, { useEffect, useState } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // // import { classService } from '../../services/classService';
// // import type { ClassSubjectResponse } from '../../types/class';
// // // import AssignTeacherModal from './AssignTeacherModal';
// // import { classService } from '../../api/class';
// // import AssignTeacherModals from './AssignTeacherModal';
// // // import AssignTeacherModal from './AssignTeacherModal';

// // interface Props {
// //   classId: number;
// // }

// // const SubjectInClass: React.FC<Props> = ({ classId }) => {
// //   const { user } = useAuth();
// //   const [subjects, setSubjects] = useState<ClassSubjectResponse[]>([]);
// //   const [page, setPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedSubject, setSelectedSubject] = useState<ClassSubjectResponse | null>(null);
// //   const [showAssignModal, setShowAssignModal] = useState(false);

// //   const isAdmin = user?.role === 'ADMIN';

// //   useEffect(() => {
// //     loadSubjects();
// //   }, [classId, page]);

// //   const loadSubjects = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await classService.getSubjects(classId, page, 10);
// //       setSubjects(res.data.content);
// //       setTotalPages(res.data.totalPages);
// //     } catch (error) {
// //       console.error('Failed to load subjects', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAssign = async (teacherId: number) => {
// //     if (!selectedSubject) return;
// //     try {
// //       await classService.assignTeacher(classId, selectedSubject.subject.id, teacherId);
// //       setShowAssignModal(false);
// //       loadSubjects();
// //     } catch (error) {
// //       alert('Failed to assign teacher');
// //     }
// //   };

// //   if (loading) return <div>Loading subjects...</div>;

// //   return (
// //     <div>
// //       {subjects.length === 0 ? (
// //         <p className="text-gray-500">No subjects assigned to this class.</p>
// //       ) : (
// //         <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
// //           <table className="min-w-full divide-y divide-gray-300">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
// //                 <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Code</th>
// //                 <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teacher</th>
// //                 {isAdmin && <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>}
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200 bg-white">
// //               {subjects.map((cs) => (
// //                 <tr key={cs.id}>
// //                   <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
// //                     {cs.subject.name}
// //                   </td>
// //                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cs.subject.code}</td>
// //                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
// //                     {cs.teacher ? `${cs.teacher.firstName} ${cs.teacher.lastName}` : 'Not assigned'}
// //                   </td>
// //                   {isAdmin && (
// //                     <td className="whitespace-nowrap px-3 py-4 text-sm">
// //                       <button
// //                         onClick={() => {
// //                           setSelectedSubject(cs);
// //                           setShowAssignModal(true);
// //                         }}
// //                         className="text-blue-600 hover:text-blue-900"
// //                       >
// //                         Assign Teacher
// //                       </button>
// //                     </td>
// //                   )}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {/* Pagination for subjects */}
// //       {totalPages > 1 && (
// //         <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
// //           <div className="flex flex-1 justify-between">
// //             <button
// //               onClick={() => setPage(page - 1)}
// //               disabled={page === 0}
// //               className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
// //             >
// //               Previous
// //             </button>
// //             <button
// //               onClick={() => setPage(page + 1)}
// //               disabled={page === totalPages - 1}
// //               className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {showAssignModal && selectedSubject && (
// //         <AssignTeacherModals
// //           subject={selectedSubject.subject}
// //           onAssign={handleAssign}
// //           onClose={() => setShowAssignModal(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default SubjectInClass;

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { classService } from '../../api/class';
// import type { ClassSubjectResponse } from '../../types/class';
// import AssignTeacherModal from './AssignTeacherModal';
// import { BookOpenIcon } from '@heroicons/react/24/outline';

// interface Props {
//   classId: number;
// }

// const SubjectInClass: React.FC<Props> = ({ classId }) => {
//   const { user } = useAuth();
//   const [subjects, setSubjects] = useState<ClassSubjectResponse[]>([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [selectedSubject, setSelectedSubject] = useState<ClassSubjectResponse | null>(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);

//   const isAdmin = user?.role === 'ADMIN';

//   useEffect(() => {
//     loadSubjects();
//   }, [classId, page]);

//   const loadSubjects = async () => {
//     try {
//       setLoading(true);
//       const res = await classService.getSubjects(classId, page, 10);
//       setSubjects(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error('Failed to load subjects', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAssign = async (teacherId: number) => {
//     if (!selectedSubject) return;
//     try {
//       await classService.assignTeacher(classId, selectedSubject.subject.id, teacherId);
//       setShowAssignModal(false);
//       loadSubjects();
//     } catch (error) {
//       alert('Failed to assign teacher');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-4">
//         <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
//         <p className="mt-2 text-sm text-gray-500">Loading subjects...</p>
//       </div>
//     );
//   }

//   if (subjects.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
//         <p className="mt-2 text-sm text-gray-500">No subjects assigned to this class.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
//               {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {subjects.map((cs) => (
//               <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {cs.subject.name}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{cs.subject.code}</td>
//                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                   {cs.teacher ? `${cs.teacher.firstName} ${cs.teacher.lastName}` : 'Not assigned'}
//                 </td>
//                 {isAdmin && (
//                   <td className="px-4 py-3 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => {
//                         setSelectedSubject(cs);
//                         setShowAssignModal(true);
//                       }}
//                       className="text-indigo-600 hover:text-indigo-900 font-medium"
//                     >
//                       Assign Teacher
//                     </button>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-4">
//           <button
//             onClick={() => setPage((p) => Math.max(0, p - 1))}
//             disabled={page === 0}
//             className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-700">
//             Page {page + 1} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//             disabled={page === totalPages - 1}
//             className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {showAssignModal && selectedSubject && (
//         <AssignTeacherModal
//           subject={selectedSubject.subject}
//           onAssign={handleAssign}
//           onClose={() => setShowAssignModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default SubjectInClass;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import type { ClassSubjectResponse } from '../../types/class';
import AssignTeacherModal from './AssignTeacherModal'; // correct import
import { BookOpenIcon } from '@heroicons/react/24/outline';
import AssignTeacherModals from './AssignTeacherModal';

interface Props {
  classId: number;
}

const SubjectInClass: React.FC<Props> = ({ classId }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<ClassSubjectResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<ClassSubjectResponse | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadSubjects();
  }, [classId, page]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await classService.getSubjects(classId, page, 10);
      setSubjects(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load subjects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (teacherId: number) => {
    if (!selectedSubject) return;
    try {
      await classService.assignTeacher(classId, selectedSubject.subject.id, teacherId);
      setShowAssignModal(false);
      loadSubjects(); // refresh list
    } catch (error) {
      alert('Failed to assign teacher');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading subjects...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No subjects assigned to this class.</p>
        {isAdmin && (
          <p className="text-sm text-gray-500 mt-1">
            Click the "Assign Subjects" button above to add subjects.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((cs) => (
              <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cs.subject.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{cs.subject.code}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {cs.teacher ? (
                    `${cs.teacher.firstName} ${cs.teacher.lastName}`
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedSubject(cs);
                        setShowAssignModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      {cs.teacher ? 'Change Teacher' : 'Assign Teacher'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* {showAssignModal && selectedSubject && (
        <AssignTeacherModal
          subject={selectedSubject.subject}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )} */}
    
      {showAssignModal && selectedSubject && (
        <AssignTeacherModals
          subject={selectedSubject.subject}
          currentTeacherId={selectedSubject.teacher?.id}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};

export default SubjectInClass;