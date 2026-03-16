// // // import React, { useEffect, useState } from 'react';
// // // import { useParams, Link } from 'react-router-dom';
// // // import { useAuth } from '../../context/AuthContext';
// // // // import { classService } from '../../services/classService';
// // // import type { ClassRoomResponse } from '../../types/class';
// // // import { classService } from '../../api/class';
// // // // import StudentsInClass from './StudentsInClass';
// // // import SubjectsInClass from './SubjextsInClass';
// // // import Layout from '../../component/layout';
// // // import StudentsInClass from './StudentsInClass';
// // // import SubjectInClass from './SubjextsInClass';
// // // // import StudentsInClass from '../../components/classes/StudentsInClass';
// // // // import SubjectsInClass from '../../components/classes/SubjectsInClass';

// // // const ClassDetail: React.FC = () => {
// // //   const { id } = useParams<{ id: string }>();
// // //   const { user } = useAuth();
// // //   const [classData, setClassData] = useState<ClassRoomResponse | null>(null);
// // //   const [loading, setLoading] = useState(true);

// // //   const isAdmin = user?.role === 'ADMIN';

// // //   useEffect(() => {
// // //     loadClass();
// // //   }, [id]);

// // //   const loadClass = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const res = await classService.getById(parseInt(id!));
// // //       setClassData(res.data);
// // //     } catch (error) {
// // //       console.error('Failed to load class', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (loading) return <div>Loading...</div>;
// // //   if (!classData) return <div>Class not found</div>;

// // //   return (
// // //     <Layout>
// // //     <div className="px-4 sm:px-6 lg:px-8">
// // //       <div className="sm:flex sm:items-center">
// // //         <div className="sm:flex-auto">
// // //           <h1 className="text-2xl font-semibold text-gray-900">
// // //             Class: {classData.name} ({classData.academicYear})
// // //           </h1>
// // //           <p className="mt-2 text-sm text-gray-700">
// // //             Class Teacher:{' '}
// // //             {classData.classTeacher
// // //               ? `${classData.classTeacher.firstName} ${classData.classTeacher.lastName}`
// // //               : 'Not assigned'}
// // //           </p>
// // //         </div>
// // //         {isAdmin && (
// // //           <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
// // //             <Link
// // //               to={`/classes/${id}/edit`}
// // //               className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
// // //             >
// // //               Edit
// // //             </Link>
// // //             <Link
// // //               to={`/classes/${id}/enroll`}
// // //               className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
// // //             >
// // //               Enroll Student
// // //             </Link>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-lg font-medium text-gray-900 mb-4">Students</h2>
// // //         <StudentsInClass classId={parseInt(id!)} />
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-lg font-medium text-gray-900 mb-4">Subjects & Teachers</h2>
// // //         <SubjectInClass classId={parseInt(id!)} />
// // //       </div>
// // //     </div>
// // //     </Layout>
// // //   );
// // // };

// // // export default ClassDetail;

// // import React, { useEffect, useState } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';
// // import { classService } from '../../api/class';
// // import type { ClassRoomResponse } from '../../types/class';
// // import Layout from '../../component/layout';
// // import StudentsInClass from './StudentsInClass';
// // import SubjectInClass from './SubjextsInClass';
// // import { AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// // const ClassDetail: React.FC = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const { user } = useAuth();
// //   const [classData, setClassData] = useState<ClassRoomResponse | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   const isAdmin = user?.role === 'ADMIN';

// //   useEffect(() => {
// //     loadClass();
// //   }, [id]);

// //   const loadClass = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await classService.getById(parseInt(id!));
// //       setClassData(res.data);
// //     } catch (error) {
// //       console.error('Failed to load class', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Layout>
// //         <div className="p-6 max-w-7xl mx-auto animate-pulse">
// //           <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
// //           <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
// //           <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
// //             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
// //             <div className="h-48 bg-gray-200 rounded"></div>
// //           </div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (!classData) {
// //     return (
// //       <Layout>
// //         <div className="p-6 max-w-7xl mx-auto text-center">
// //           <p className="text-gray-500">Class not found.</p>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout>
// //       <div className="p-6 max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">
// //               Class: {classData.name} ({classData.academicYear})
// //             </h1>
// //             <p className="mt-1 text-sm text-gray-600">
// //               Class Teacher:{' '}
// //               {classData.classTeacher ? (
// //                 <span className="font-medium">
// //                   {classData.classTeacher.firstName} {classData.classTeacher.lastName}
// //                 </span>
// //               ) : (
// //                 <span className="text-gray-400 italic">Not assigned</span>
// //               )}
// //             </p>
// //           </div>
// //           {isAdmin && (
// //             <div className="mt-4 sm:mt-0 space-x-3">
// //               <Link
// //                 to={`/classes/${id}/edit`}
// //                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
// //               >
// //                 Edit Class
// //               </Link>
// //               <Link
// //                 to={`/classes/${id}/enroll`}
// //                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
// //               >
// //                 <UserGroupIcon className="h-5 w-5 mr-2" />
// //                 Enroll Student
// //               </Link>
// //             </div>
// //           )}
// //         </div>

// //         {/* Students Section */}
// //         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden mb-8">
// //           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
// //             <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
// //             <h2 className="text-lg font-medium text-gray-800">Students</h2>
// //           </div>
// //           <div className="p-6">
// //             <StudentsInClass classId={parseInt(id!)} />
// //           </div>
// //         </div>

// //         {/* Subjects Section */}
// //         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
// //             <AcademicCapIcon className="h-5 w-5 text-indigo-500 mr-2" />
// //             <h2 className="text-lg font-medium text-gray-800">Subjects & Teachers</h2>
// //           </div>
// //           <div className="p-6">
// //             <SubjectInClass classId={parseInt(id!)} />
// //           </div>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default ClassDetail;


// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { classService } from '../../api/class';
// import type { ClassRoomResponse } from '../../types/class';
// import Layout from '../../component/layout';
// import StudentsInClass from './StudentsInClass';
// import SubjectInClass from './SubjextsInClass';
// // import AssignSubjectModal from '../../components/classes/AssignSubjectModal'; // new modal
// import { AcademicCapIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
// import AssignSubjectModal from './AssignSubjectModel';

// const ClassDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [classData, setClassData] = useState<ClassRoomResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showAssignSubjectModal, setShowAssignSubjectModal] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0); // to refresh subjects after assignment

//   const isAdmin = user?.role === 'ADMIN';

//   useEffect(() => {
//     loadClass();
//   }, [id]);

//   const loadClass = async () => {
//     try {
//       setLoading(true);
//       const res = await classService.getById(parseInt(id!));
//       setClassData(res.data);
//     } catch (error) {
//       console.error('Failed to load class', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubjectsAssigned = () => {
//     setRefreshKey(prev => prev + 1); // force SubjectInClass to reload
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="p-6 max-w-7xl mx-auto animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
//           <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
//             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//             <div className="h-48 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!classData) {
//     return (
//       <Layout>
//         <div className="p-6 max-w-7xl mx-auto text-center">
//           <p className="text-gray-500">Class not found.</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Class: {classData.name} ({classData.academicYear})
//             </h1>
//             <p className="mt-1 text-sm text-gray-600">
//               Class Teacher:{' '}
//               {classData.classTeacher ? (
//                 <span className="font-medium">
//                   {classData.classTeacher.firstName} {classData.classTeacher.lastName}
//                 </span>
//               ) : (
//                 <span className="text-gray-400 italic">Not assigned</span>
//               )}
//             </p>
//           </div>
//           {isAdmin && (
//             <div className="mt-4 sm:mt-0 space-x-3">
//               <Link
//                 to={`/classes/${id}/edit`}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Edit Class
//               </Link>
//               <Link
//                 to={`/classes/${id}/enroll`}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
//               >
//                 <UserGroupIcon className="h-5 w-5 mr-2" />
//                 Enroll Student
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Students Section */}
//         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden mb-8">
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
//             <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
//             <h2 className="text-lg font-medium text-gray-800">Students</h2>
//           </div>
//           <div className="p-6">
//             <StudentsInClass classId={parseInt(id!)} />
//           </div>
//         </div>

//         {/* Subjects Section */}
//         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
//             <div className="flex items-center">
//               <AcademicCapIcon className="h-5 w-5 text-indigo-500 mr-2" />
//               <h2 className="text-lg font-medium text-gray-800">Subjects & Teachers</h2>
//             </div>
//             {isAdmin && (
//               <button
//                 onClick={() => setShowAssignSubjectModal(true)}
//                 className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
//               >
//                 <PlusIcon className="h-4 w-4 mr-1" />
//                 Assign Subjects
//               </button>
//             )}
//           </div>
//           <div className="p-6">
//             <SubjectInClass key={refreshKey} classId={parseInt(id!)} />
//           </div>
//         </div>
//       </div>

//       {/* Assign Subject Modal */}
//       {showAssignSubjectModal && (
//         <AssignSubjectModal
//           classId={parseInt(id!)}
//           onClose={() => setShowAssignSubjectModal(false)}
//           onSuccess={handleSubjectsAssigned}
//         />
//       )}
//     </Layout>
//   );
// };

// export default ClassDetail;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import type { ClassRoomResponse } from '../../types/class';
import Layout from '../../component/layout';
import StudentsInClass from './StudentsInClass';
// import SubjectInClass from './SubjectInClass';
// import AssignSubjectModal from '../../components/classes/AssignSubjectModal'; // new modal
import { AcademicCapIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import SubjectInClass from './SubjextsInClass';
import AssignSubjectModal from './AssignSubjectModel';
// import AssignSubjectModal from './AssignSubjectModel';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [classData, setClassData] = useState<ClassRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAssignSubjectModal, setShowAssignSubjectModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadClass();
  }, [id]);

  const loadClass = async () => {
    try {
      setLoading(true);
      const res = await classService.getById(parseInt(id!));
      setClassData(res.data);
    } catch (error) {
      console.error('Failed to load class', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectsAssigned = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!classData) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Class not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Class: {classData.name} ({classData.academicYear})
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Class Teacher:{' '}
              {classData.classTeacher ? (
                <span className="font-medium">
                  {classData.classTeacher.firstName} {classData.classTeacher.lastName}
                </span>
              ) : (
                <span className="text-gray-400 italic">Not assigned</span>
              )}
            </p>
          </div>
          {isAdmin && (
            <div className="mt-4 sm:mt-0 space-x-3">
              <Link
                to={`/classes/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit Class
              </Link>
              <Link
                to={`/classes/${id}/enroll`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Enroll Student
              </Link>
            </div>
          )}
        </div>

        {/* Students Section */}
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Students</h2>
          </div>
          <div className="p-6">
            <StudentsInClass classId={parseInt(id!)} />
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <AcademicCapIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Subjects & Teachers</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAssignSubjectModal(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Assign Subjects
              </button>
            )}
          </div>
          <div className="p-6">
            <SubjectInClass key={refreshKey} classId={parseInt(id!)} />
          </div>
        </div>
      </div>

      {/* Assign Subject Modal */}
      {showAssignSubjectModal && (
        <AssignSubjectModal
          classId={parseInt(id!)}
          onClose={() => setShowAssignSubjectModal(false)}
          onSuccess={handleSubjectsAssigned}
        />
      )}
    </Layout>
  );
};

export default ClassDetail;