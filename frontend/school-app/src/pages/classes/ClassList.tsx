// // import React, { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';
// // // import { classService } from '../../services/classService';
// // import type { ClassRoomResponse } from '../../types/class';
// // import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
// // import { classService } from '../../api/class';
// // import Layout from '../../component/layout';

// // const ClassList: React.FC = () => {
// //   const { user } = useAuth();
// //   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
// //   const [page, setPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [loading, setLoading] = useState(true);

// //   const isAdmin = user?.role === 'ADMIN';

// //   useEffect(() => {
// //     loadClasses();
// //   }, [page]);

// //   const loadClasses = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await classService.getAll(page, 10);
// //       setClasses(res.data.content);
// //       setTotalPages(res.data.totalPages);
// //     } catch (error) {
// //       console.error('Failed to load classes', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!window.confirm('Are you sure you want to delete this class?')) return;
// //     try {
// //       await classService.delete(id);
// //       loadClasses();
// //     } catch (error) {
// //       alert('Failed to delete class');
// //     }
// //   };

// //   return (
// //     <Layout>
// //     <div className="px-4 sm:px-6 lg:px-8">
// //       <div className="sm:flex sm:items-center">
// //         <div className="sm:flex-auto">
// //           <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
// //           <p className="mt-2 text-sm text-gray-700">
// //             List of all classes with their teachers and student counts.
// //           </p>
// //         </div>
// //         {isAdmin && (
// //           <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
// //             <Link
// //               to="/classes/new"
// //               className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
// //             >
// //               Add Class
// //             </Link>
// //           </div>
// //         )}
// //       </div>

// //       <div className="mt-8 flex flex-col">
// //         <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
// //           <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
// //             <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
// //               {loading ? (
// //                 <div className="text-center py-4">Loading...</div>
// //               ) : (
// //                 <table className="min-w-full divide-y divide-gray-300">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Academic Year</th>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class Teacher</th>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Students</th>
// //                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-gray-200 bg-white">
// //                     {classes.map((cls) => (
// //                       <tr key={cls.id}>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cls.id}</td>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{cls.name}</td>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cls.academicYear}</td>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
// //                           {cls.classTeacher
// //                             ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}`
// //                             : '-'}
// //                         </td>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cls.studentCount}</td>
// //                         <td className="whitespace-nowrap px-3 py-4 text-sm">
// //                           <div className="flex items-center space-x-2">
// //                             <Link
// //                               to={`/classes/${cls.id}`}
// //                               className="text-blue-600 hover:text-blue-900"
// //                               title="View"
// //                             >
// //                               <EyeIcon className="h-5 w-5" />
// //                             </Link>
// //                             {isAdmin && (
// //                               <>
// //                                 <Link
// //                                   to={`/classes/${cls.id}/edit`}
// //                                   className="text-yellow-600 hover:text-yellow-900"
// //                                   title="Edit"
// //                                 >
// //                                   <PencilIcon className="h-5 w-5" />
// //                                 </Link>
// //                                 <button
// //                                   onClick={() => handleDelete(cls.id)}
// //                                   className="text-red-600 hover:text-red-900"
// //                                   title="Delete"
// //                                 >
// //                                   <TrashIcon className="h-5 w-5" />
// //                                 </button>
// //                               </>
// //                             )}
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Pagination */}
// //       {totalPages > 1 && (
// //         <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
// //           <div className="flex flex-1 justify-between sm:hidden">
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
// //           <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
// //             <div>
// //               <p className="text-sm text-gray-700">
// //                 Page <span className="font-medium">{page + 1}</span> of{' '}
// //                 <span className="font-medium">{totalPages}</span>
// //               </p>
// //             </div>
// //             <div>
// //               <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
// //                 <button
// //                   onClick={() => setPage(page - 1)}
// //                   disabled={page === 0}
// //                   className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// //                 >
// //                   Previous
// //                 </button>
// //                 <button
// //                   onClick={() => setPage(page + 1)}
// //                   disabled={page === totalPages - 1}
// //                   className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// //                 >
// //                   Next
// //                 </button>
// //               </nav>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //     </Layout>
// //   );
// // };

// // export default ClassList;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { classService } from '../../api/class';
// import type { ClassRoomResponse } from '../../types/class';
// import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
// import Layout from '../../component/layout';

// const ClassList: React.FC = () => {
//   const { user } = useAuth();
//   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const isAdmin = user?.role === 'ADMIN';

//   useEffect(() => {
//     loadClasses();
//   }, [page]);

//   const loadClasses = async () => {
//     try {
//       setLoading(true);
//       const res = await classService.getAll(page, 10);
//       setClasses(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error('Failed to load classes', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this class?')) return;
//     try {
//       await classService.delete(id);
//       if (classes.length === 1 && page > 0) {
//         setPage(page - 1);
//       } else {
//         loadClasses();
//       }
//     } catch (error) {
//       alert('Failed to delete class');
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
//           </div>
//           {isAdmin && (
//             <Link
//               to="/classes/new"
//               className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <PlusIcon className="h-5 w-5 mr-2" />
//               Add Class
//             </Link>
//           )}
//         </div>

//         {/* Table */}
//         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//               <p className="mt-2 text-gray-500">Loading classes...</p>
//             </div>
//           ) : classes.length === 0 ? (
//             <div className="p-12 text-center">
//               <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {isAdmin ? 'Get started by creating a new class.' : 'There are no classes available.'}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Teacher</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {classes.map((cls) => (
//                     <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.academicYear}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.studentCount}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center space-x-3">
//                           <Link
//                             to={`/classes/${cls.id}`}
//                             className="text-indigo-600 hover:text-indigo-900"
//                             title="View"
//                           >
//                             <EyeIcon className="h-5 w-5" />
//                           </Link>
//                           {isAdmin && (
//                             <>
//                               <Link
//                                 to={`/classes/${cls.id}/edit`}
//                                 className="text-amber-600 hover:text-amber-900"
//                                 title="Edit"
//                               >
//                                 <PencilIcon className="h-5 w-5" />
//                               </Link>
//                               <button
//                                 onClick={() => handleDelete(cls.id)}
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Delete"
//                               >
//                                 <TrashIcon className="h-5 w-5" />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//               <button
//                 onClick={() => setPage((p) => Math.max(0, p - 1))}
//                 disabled={page === 0}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-700">
//                 Page {page + 1} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//                 disabled={page === totalPages - 1}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ClassList;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import type { ClassRoomResponse } from '../../types/class';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Layout from '../../component/layout';

// Confirmation Modal Component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ClassList: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadClasses();
  }, [page]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await classService.getAll(page, 10);
      setClasses(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load classes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setClassToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    setShowDeleteModal(false);
    try {
      await classService.delete(classToDelete);
      if (classes.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadClasses();
      }
    } catch (error) {
      alert('Failed to delete class');
    } finally {
      setClassToDelete(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          </div>
          {isAdmin && (
            <Link
              to="/classes/new"
              className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Class
            </Link>
          )}
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="p-12 text-center">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isAdmin ? 'Get started by creating a new class.' : 'There are no classes available.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.academicYear}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.studentCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/classes/${cls.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                to={`/classes/${cls.id}/edit`}
                                className="text-amber-600 hover:text-amber-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(cls.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Layout>
  );
};

export default ClassList;