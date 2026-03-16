// // // import React, { useEffect, useState } from 'react';
// // // // import { userApi } from '../../api/userApi';
// // // import type { SubjectResponse } from '../../types/class';
// // // import type { AnyUser } from '../../types/user';
// // // import { userApi } from '../../api/users';

// // // interface Props {
// // //   subject: SubjectResponse;
// // //   onAssign: (teacherId: number) => void;
// // //   onClose: () => void;
// // // }

// // // const AssignTeacherModals: React.FC<Props> = ({ subject, onAssign, onClose }) => {
// // //   const [teachers, setTeachers] = useState<AnyUser[]>([]);
// // //   const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchTeachers = async () => {
// // //       try {
// // //         const res = await userApi.getByRole('TEACHER', 0, 100);
// // //         setTeachers(res.data.content);
// // //       } catch (error) {
// // //         console.error('Failed to load teachers', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchTeachers();
// // //   }, []);

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (selectedTeacherId) {
// // //       onAssign(Number(selectedTeacherId));
// // //     }
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
// // //       <div className="bg-white rounded-lg p-6 max-w-md w-full">
// // //         <h3 className="text-lg font-medium mb-4">Assign Teacher to {subject.name}</h3>
// // //         {loading ? (
// // //           <p>Loading teachers...</p>
// // //         ) : (
// // //           <form onSubmit={handleSubmit}>
// // //             <select
// // //               value={selectedTeacherId}
// // //               onChange={(e) => setSelectedTeacherId(e.target.value ? Number(e.target.value) : '')}
// // //               className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
// // //               required
// // //             >
// // //               <option value="">Select a teacher</option>
// // //               {teachers.map((teacher) => (
// // //                 <option key={teacher.id} value={teacher.id}>
// // //                   {teacher.firstName} {teacher.lastName} ({teacher.email})
// // //                 </option>
// // //               ))}
// // //             </select>
// // //             <div className="mt-4 flex justify-end space-x-2">
// // //               <button
// // //                 type="button"
// // //                 onClick={onClose}
// // //                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 type="submit"
// // //                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
// // //               >
// // //                 Assign
// // //               </button>
// // //             </div>
// // //           </form>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AssignTeacherModals;

// // import React, { useEffect, useState, useRef } from 'react';
// // import type { SubjectResponse } from '../../types/class';
// // import type { AnyUser } from '../../types/user';
// // import { userApi } from '../../api/users';

// // interface Props {
// //   subject: SubjectResponse;
// //   onAssign: (teacherId: number) => void;
// //   onClose: () => void;
// // }

// // const AssignTeacherModals: React.FC<Props> = ({ subject, onAssign, onClose }) => {
// //   const [teachers, setTeachers] = useState<AnyUser[]>([]);
// //   const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const [filteredTeachers, setFilteredTeachers] = useState<AnyUser[]>([]);

// //   useEffect(() => {
// //     const fetchTeachers = async () => {
// //       try {
// //         const res = await userApi.getByRole('TEACHER', 0, 100);
// //         setTeachers(res.data.content);
// //       } catch (error) {
// //         console.error('Failed to load teachers', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTeachers();
// //   }, []);

// //   useEffect(() => {
// //     if (search.trim() === '') {
// //       setFilteredTeachers(teachers);
// //     } else {
// //       const lower = search.toLowerCase();
// //       setFilteredTeachers(
// //         teachers.filter(
// //           t =>
// //             t.firstName.toLowerCase().includes(lower) ||
// //             t.lastName.toLowerCase().includes(lower) ||
// //             t.email.toLowerCase().includes(lower)
// //         )
// //       );
// //     }
// //   }, [search, teachers]);

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
// //         setIsOpen(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, []);

// //   const handleSelectTeacher = (teacherId: number, displayName: string) => {
// //     setSelectedTeacherId(teacherId);
// //     setSearch(displayName);
// //     setIsOpen(false);
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (selectedTeacherId) {
// //       onAssign(Number(selectedTeacherId));
// //     }
// //   };

// //   const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

// //   return (
// //     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-lg p-6 max-w-md w-full">
// //         <h3 className="text-lg font-medium mb-4">Assign Teacher to {subject.name}</h3>
// //         {loading ? (
// //           <p>Loading teachers...</p>
// //         ) : (
// //           <form onSubmit={handleSubmit}>
// //             <div className="relative" ref={containerRef}>
// //               <input
// //                 type="text"
// //                 value={search}
// //                 onChange={(e) => {
// //                   setSearch(e.target.value);
// //                   setIsOpen(true);
// //                   if (selectedTeacherId && e.target.value !== selectedTeacher?.firstName + ' ' + selectedTeacher?.lastName + ' (' + selectedTeacher?.email + ')') {
// //                     // If user types and it doesn't match the selected teacher, clear selection
// //                     setSelectedTeacherId('');
// //                   }
// //                 }}
// //                 onFocus={() => setIsOpen(true)}
// //                 placeholder="Search teacher..."
// //                 className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
// //                 required
// //               />
// //               {isOpen && filteredTeachers.length > 0 && (
// //                 <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
// //                   {filteredTeachers.map(teacher => (
// //                     <li
// //                       key={teacher.id}
// //                       onClick={() => handleSelectTeacher(teacher.id, `${teacher.firstName} ${teacher.lastName} (${teacher.email})`)}
// //                       className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
// //                     >
// //                       {teacher.firstName} {teacher.lastName} ({teacher.email})
// //                     </li>
// //                   ))}
// //                 </ul>
// //               )}
// //             </div>
// //             <div className="mt-4 flex justify-end space-x-2">
// //               <button
// //                 type="button"
// //                 onClick={onClose}
// //                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 disabled={!selectedTeacherId}
// //                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
// //               >
// //                 Assign
// //               </button>
// //             </div>
// //           </form>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AssignTeacherModals;

// import React, { useEffect, useState, useRef } from 'react';
// import type { SubjectResponse } from '../../types/class';
// import type { AnyUser } from '../../types/user';
// import { userApi } from '../../api/users';

// interface Props {
//   subject: SubjectResponse;
//   onAssign: (teacherId: number) => void;
//   onClose: () => void;
// }

// const AssignTeacherModals: React.FC<Props> = ({ subject, onAssign, onClose }) => {
//   const [teachers, setTeachers] = useState<AnyUser[]>([]);
//   const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [filteredTeachers, setFilteredTeachers] = useState<AnyUser[]>([]);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const res = await userApi.getByRole('TEACHER', 0, 100);
//         // Handle both paginated and non-paginated responses
//         const teacherData = Array.isArray(res.data)
//           ? res.data
//           : res.data.content || [];
//         setTeachers(teacherData);
//       } catch (error) {
//         console.error('Failed to load teachers', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeachers();
//   }, []);

//   useEffect(() => {
//     if (search.trim() === '') {
//       setFilteredTeachers(teachers);
//     } else {
//       const lower = search.toLowerCase();
//       setFilteredTeachers(
//         teachers.filter(
//           t =>
//             t.firstName.toLowerCase().includes(lower) ||
//             t.lastName.toLowerCase().includes(lower) ||
//             t.email.toLowerCase().includes(lower)
//         )
//       );
//     }
//   }, [search, teachers]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSelectTeacher = (teacherId: number, displayName: string) => {
//     setSelectedTeacherId(teacherId);
//     setSearch(displayName);
//     setIsOpen(false);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedTeacherId) {
//       onAssign(Number(selectedTeacherId));
//     }
//   };

//   const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <h3 className="text-lg font-medium mb-4">Assign Teacher to {subject.name}</h3>
//         {loading ? (
//           <p>Loading teachers...</p>
//         ) : teachers.length === 0 ? (
//           <div>
//             <p className="text-red-600">No teachers available. Please add teachers first.</p>
//             <div className="mt-4 flex justify-end">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="relative" ref={containerRef}>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setIsOpen(true);
//                   // Clear selection if input doesn't match selected teacher's full name
//                   if (selectedTeacherId) {
//                     const selectedDisplay = selectedTeacher
//                       ? `${selectedTeacher.firstName} ${selectedTeacher.lastName} (${selectedTeacher.email})`
//                       : '';
//                     if (e.target.value !== selectedDisplay) {
//                       setSelectedTeacherId('');
//                     }
//                   }
//                 }}
//                 onFocus={() => setIsOpen(true)}
//                 placeholder="Search teacher..."
//                 className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//               {isOpen && filteredTeachers.length > 0 && (
//                 <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
//                   {filteredTeachers.map(teacher => (
//                     <li
//                       key={teacher.id}
//                       onClick={() => handleSelectTeacher(teacher.id, `${teacher.firstName} ${teacher.lastName} (${teacher.email})`)}
//                       className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
//                     >
//                       {teacher.firstName} {teacher.lastName} ({teacher.email})
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={!selectedTeacherId}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//               >
//                 Assign
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignTeacherModals;

import React, { useEffect, useState, useRef } from 'react';
import type { SubjectResponse } from '../../types/class';
import type { AnyUser } from '../../types/user';
import { userApi } from '../../api/users';

interface Props {
  subject: SubjectResponse;
  currentTeacherId?: number; // new prop
  onAssign: (teacherId: number) => void;
  onClose: () => void;
}

const AssignTeacherModals: React.FC<Props> = ({ subject, currentTeacherId, onAssign, onClose }) => {
  const [teachers, setTeachers] = useState<AnyUser[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>(currentTeacherId || '');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filteredTeachers, setFilteredTeachers] = useState<AnyUser[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await userApi.getByRole('TEACHER', 0, 100);
        const teacherData = Array.isArray(res.data) ? res.data : res.data.content || [];
        setTeachers(teacherData);
      } catch (error) {
        console.error('Failed to load teachers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // After teachers are loaded, if there's a currentTeacherId, set the search text
  useEffect(() => {
    if (teachers.length > 0 && currentTeacherId) {
      const teacher = teachers.find(t => t.id === currentTeacherId);
      if (teacher) {
        setSearch(`${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
      }
    }
  }, [teachers, currentTeacherId]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const lower = search.toLowerCase();
      setFilteredTeachers(
        teachers.filter(
          t =>
            t.firstName.toLowerCase().includes(lower) ||
            t.lastName.toLowerCase().includes(lower) ||
            t.email.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, teachers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTeacher = (teacherId: number, displayName: string) => {
    setSelectedTeacherId(teacherId);
    setSearch(displayName);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeacherId) {
      onAssign(Number(selectedTeacherId));
    }
  };

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Assign Teacher to {subject.name}</h3>
        {loading ? (
          <p>Loading teachers...</p>
        ) : teachers.length === 0 ? (
          <div>
            <p className="text-red-600">No teachers available. Please add teachers first.</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="relative" ref={containerRef}>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsOpen(true);
                  // Clear selection if input doesn't match selected teacher's full name
                  if (selectedTeacherId) {
                    const selectedDisplay = selectedTeacher
                      ? `${selectedTeacher.firstName} ${selectedTeacher.lastName} (${selectedTeacher.email})`
                      : '';
                    if (e.target.value !== selectedDisplay) {
                      setSelectedTeacherId('');
                    }
                  }
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search teacher..."
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {isOpen && filteredTeachers.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {filteredTeachers.map(teacher => (
                    <li
                      key={teacher.id}
                      onClick={() => handleSelectTeacher(teacher.id, `${teacher.firstName} ${teacher.lastName} (${teacher.email})`)}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                    >
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTeacherId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignTeacherModals;