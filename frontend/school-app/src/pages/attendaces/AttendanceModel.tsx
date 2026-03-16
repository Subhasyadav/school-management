import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import { useAttendance, useStudentAttendance } from '../../hooks/useAttendance';
import { useChildren } from '../../hooks/useChildren';
// import UpdateAttendanceModal from './UpdateAttendanceModal';
// import MarkAttendanceModal from './MarkAttendanceModal';
import StudentAttendanceCalendar from './StudentAttendanceCalendar'; // we'll create this
import Layout from '../../component/layout';
import toast from 'react-hot-toast';
import type { AttendanceFilter, AttendanceResponse } from '../../types/attendance';
import type { ClassRoomResponse } from '../../types/class';
import UpdateAttendanceModal from './UpdateAttendaceModel';
import MarkAttendanceModal from './MarkAttendanceModel';

const PAGE_SIZE = 20;

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  // View mode (table or calendar) – default to calendar for teachers/admins, table for others
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>(
    canManage ? 'calendar' : 'table'
  );

  // Filters for teacher/admin
  const [filter, setFilter] = useState<AttendanceFilter>({});
  const [page, setPage] = useState(0);
  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);

  // Modals
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // Parent child selection
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // Load classes for teachers/admins
  useEffect(() => {
    if (canManage) {
      classService.getAll(0, 100)
        .then((res) => setClasses(res.data.content))
        .catch(() => toast.error('Failed to load classes'));
    }
  }, [canManage]);

  // Load children for parents
  const { data: childrenData, isLoading: loadingChildren } = useChildren(
    isParent ? user!.id : undefined,
    isParent
  );
  const children = childrenData?.content || [];

  useEffect(() => {
    if (isParent && children.length > 0 && selectedChildId === null) {
      setSelectedChildId(children[0].id);
    }
  }, [isParent, children, selectedChildId]);

  // Data fetching based on role
  const {
    data: attendanceData,
    isLoading,
    isError,
    refetch,
  } = isStudent
    ? useStudentAttendance(user!.id, page, true)
    : isParent
    ? useStudentAttendance(selectedChildId!, page, !!selectedChildId)
    : useAttendance(filter, page, canManage && !!filter.classId && !!filter.date);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: name === 'classId' ? (value ? Number(value) : undefined) : value,
    }));
    setPage(0);
  };

  const openUpdateModal = (att: AttendanceResponse) => {
    setSelectedAttendance(att);
    setIsUpdateModalOpen(true);
  };

  const handleMarkSaved = () => refetch();

  const totalPages = attendanceData?.totalPages || 0;
  const canNext = page < totalPages - 1;
  const canPrev = page > 0;

  const renderChildSelector = () => {
    if (!isParent) return null;
    if (loadingChildren) return <div className="text-gray-500">Loading children...</div>;
    if (children.length === 0) return <div className="text-gray-500">No children linked to your account.</div>;
    if (children.length === 1) {
      return (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Viewing attendance for: </span>
          <span className="text-sm text-gray-900">{children[0].firstName} {children[0].lastName}</span>
        </div>
      );
    }
    return (
      <div className="mb-4">
        <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
        <select
          id="child"
          value={selectedChildId ?? ''}
          onChange={(e) => setSelectedChildId(Number(e.target.value))}
          className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>{child.firstName} {child.lastName}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Attendance Management</h2>

        {/* Teacher/Admin Controls */}
        {canManage && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-end">
                <div>
                  <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Class</label>
                  <select
                    id="classId"
                    name="classId"
                    value={filter.classId ?? ''}
                    onChange={handleFilterChange}
                    className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filter.date ?? ''}
                    onChange={handleFilterChange}
                    className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setIsMarkModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Mark Attendance
                </button>
              </div>

              {/* View toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md transition ${
                    viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded-md transition ${
                    viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {!filter.classId && !filter.date && (
              <p className="text-gray-500 mb-4">Please select a class and date to view attendance.</p>
            )}
          </>
        )}

        {/* Parent View */}
        {isParent && renderChildSelector()}

        {/* Student View */}
        {isStudent && <p className="mb-4 text-gray-600">Your attendance records:</p>}

        {/* Loading & Error States */}
        {isLoading && <div className="text-center py-8 text-gray-500">Loading attendance...</div>}
        {isError && <div className="text-center py-8 text-red-600">Failed to load attendance. Please try again.</div>}

        {/* Calendar View (only for teachers/admins with class selected) */}
        {!isLoading && !isError && viewMode === 'calendar' && canManage && filter.classId && (
          <StudentAttendanceCalendar classId={filter.classId} readOnly={!canManage} />
        )}

        {/* Table View */}
        {!isLoading && !isError && viewMode === 'table' && attendanceData && attendanceData.content.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marked By</th>
                    {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.content.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.subjectName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          att.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                          att.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                          att.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.remarks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.markedBy}</td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openUpdateModal(att)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
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
              <span className="text-sm text-gray-700">Page {page + 1} of {totalPages}</span>
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

        {/* Empty state */}
        {!isLoading && !isError && viewMode === 'table' && attendanceData?.content.length === 0 && (
          <div className="text-center py-8 text-gray-500">No attendance records found.</div>
        )}

        {/* Modals */}
        {isUpdateModalOpen && selectedAttendance && (
          <UpdateAttendanceModal
            attendance={selectedAttendance}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedAttendance(null);
            }}
            onSaved={refetch}
          />
        )}

        {isMarkModalOpen && (
          <MarkAttendanceModal
            onClose={() => setIsMarkModalOpen(false)}
            onSaved={handleMarkSaved}
          />
        )}
      </div>
    </Layout>
  );
};

export default AttendanceManagement;

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { classService } from '../../api/class';
// import { useAttendance, useStudentAttendance } from '../../hooks/useAttendance';
// import { useChildren } from '../../hooks/useChildren';
// import Layout from '../../component/layout';
// import toast from 'react-hot-toast';
// import type { AttendanceFilter, AttendanceResponse } from '../../types/attendance';
// import type { ClassRoomResponse } from '../../types/class';
// import UpdateAttendanceModal from './UpdateAttendaceModel';
// import MarkAttendanceModal from './MarkAttendanceModel';

// const PAGE_SIZE = 20;

// const AttendanceManagement: React.FC = () => {
//   const { user } = useAuth();
//   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';
//   const isStudent = user?.role === 'STUDENT';
//   const isParent = user?.role === 'PARENT';

//   const [filter, setFilter] = useState<AttendanceFilter>({});
//   const [page, setPage] = useState(0);
//   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
//   const [selectedAttendance, setSelectedAttendance] = useState<AttendanceResponse | null>(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
//   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

//   useEffect(() => {
//     if (canManage) {
//       classService.getAll(0, 100)
//         .then((res) => setClasses(res.data.content))
//         .catch(() => toast.error('Failed to load classes'));
//     }
//   }, [canManage]);

//   const { data: childrenData, isLoading: loadingChildren } = useChildren(
//     isParent ? user!.id : undefined,
//     isParent
//   );
//   const children = childrenData?.content || [];

//   useEffect(() => {
//     if (isParent && children.length > 0 && selectedChildId === null) {
//       setSelectedChildId(children[0].id);
//     }
//   }, [isParent, children, selectedChildId]);

//   const {
//     data: attendanceData,
//     isLoading,
//     isError,
//     refetch,
//   } = isStudent
//     ? useStudentAttendance(user!.id, page, true)
//     : isParent
//     ? useStudentAttendance(selectedChildId!, page, !!selectedChildId)
//     : useAttendance(filter, page, canManage && !!filter.classId && !!filter.date);

//   const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({
//       ...prev,
//       [name]: name === 'classId' ? (value ? Number(value) : undefined) : value,
//     }));
//     setPage(0);
//   };

//   const openUpdateModal = (att: AttendanceResponse) => {
//     setSelectedAttendance(att);
//     setIsUpdateModalOpen(true);
//   };

//   const handleMarkSaved = () => refetch();

//   const totalPages = attendanceData?.totalPages || 0;
//   const canNext = page < totalPages - 1;
//   const canPrev = page > 0;

//   const renderChildSelector = () => {
//     if (!isParent) return null;
//     if (loadingChildren) return <div className="text-gray-500">Loading children...</div>;
//     if (children.length === 0) return <div className="text-gray-500">No children linked to your account.</div>;
//     if (children.length === 1) {
//       return (
//         <div className="mb-4">
//           <span className="text-sm font-medium text-gray-700">Viewing attendance for: </span>
//           <span className="text-sm text-gray-900">{children[0].firstName} {children[0].lastName}</span>
//         </div>
//       );
//     }
//     return (
//       <div className="mb-4">
//         <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
//         <select
//           id="child"
//           value={selectedChildId ?? ''}
//           onChange={(e) => setSelectedChildId(Number(e.target.value))}
//           className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//         >
//           {children.map((child) => (
//             <option key={child.id} value={child.id}>{child.firstName} {child.lastName}</option>
//           ))}
//         </select>
//       </div>
//     );
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h2 className="text-2xl font-semibold mb-4">Attendance Management</h2>

//         {canManage && (
//           <>
//             <div className="flex gap-4 mb-4 items-end">
//               <div>
//                 <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Class</label>
//                 <select
//                   id="classId"
//                   name="classId"
//                   value={filter.classId ?? ''}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select class</option>
//                   {classes.map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={filter.date ?? ''}
//                   onChange={handleFilterChange}
//                   className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <button
//                 onClick={() => setIsMarkModalOpen(true)}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 Mark Attendance
//               </button>
//             </div>
//             {!filter.classId && !filter.date && (
//               <p className="text-gray-500 mb-4">Please select a class and date to view attendance.</p>
//             )}
//           </>
//         )}

//         {isParent && renderChildSelector()}
//         {isStudent && <p className="mb-4 text-gray-600">Your attendance records:</p>}

//         {isLoading && <div className="text-center py-8 text-gray-500">Loading attendance...</div>}
//         {isError && <div className="text-center py-8 text-red-600">Failed to load attendance. Please try again.</div>}

//         {!isLoading && attendanceData && attendanceData.content.length > 0 && (
//           <>
//             <div className="overflow-x-auto bg-white rounded-lg shadow">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marked By</th>
//                     {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {attendanceData.content.map((att) => (
//                     <tr key={att.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.studentName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.className}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.subjectName || '-'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.date}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           att.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
//                           att.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
//                           att.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {att.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.remarks}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.markedBy}</td>
//                       {canManage && (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() => openUpdateModal(att)}
//                             className="text-indigo-600 hover:text-indigo-900"
//                           >
//                             Edit
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center justify-center gap-4 mt-4">
//               <button
//                 onClick={() => setPage((p) => p - 1)}
//                 disabled={!canPrev}
//                 className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-700">Page {page + 1} of {totalPages}</span>
//               <button
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={!canNext}
//                 className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}

//         {!isLoading && attendanceData && attendanceData.content.length === 0 && (
//           <div className="text-center py-8 text-gray-500">No attendance records found.</div>
//         )}

//         {isUpdateModalOpen && selectedAttendance && (
//           <UpdateAttendanceModal
//             attendance={selectedAttendance}
//             onClose={() => {
//               setIsUpdateModalOpen(false);
//               setSelectedAttendance(null);
//             }}
//             onSaved={refetch}
//           />
//         )}

//         {isMarkModalOpen && (
//           <MarkAttendanceModal
//             onClose={() => setIsMarkModalOpen(false)}
//             onSaved={handleMarkSaved}
//           />
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default AttendanceManagement;