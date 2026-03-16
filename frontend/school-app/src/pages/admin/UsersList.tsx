// // import React, { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import {
// //   PencilIcon,
// //   TrashIcon,
// //   UserPlusIcon,
// //   MagnifyingGlassIcon,
// //   XMarkIcon,
// //   UserGroupIcon,
// // } from '@heroicons/react/24/outline';
// // import { userApi } from '../../api/users';
// // import { ROLES } from '../../utils/constants';
// // import Layout from '../../component/layout';
// // import UserForm from '../../component/users/UserForm';
// // import toast from 'react-hot-toast';
// // import type { AnyUser, UserCreateRequest, UserUpdateRequest } from '../../types/user';

// // const UsersList: React.FC = () => {
// //   const [users, setUsers] = useState<AnyUser[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [page, setPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [roleFilter, setRoleFilter] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

// //   // Modal state for adding a user
// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);

// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     try {
// //       const response = roleFilter
// //         ? await userApi.getByRole(roleFilter, page, 10)
// //         : await userApi.getAll(page, 10);

// //       setUsers(response.data?.content ?? []);
// //       setTotalPages(response.data?.totalPages ?? 0);
// //     } catch (error) {
// //       toast.error('Failed to load users');
// //       setUsers([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers();
// //   }, [page, roleFilter]);

// //   const handleDelete = async (id: number) => {
// //     try {
// //       await userApi.delete(id);
// //       toast.success('User deleted successfully');
// //       if (users.length === 1 && page > 0) {
// //         setPage(page - 1);
// //       } else {
// //         fetchUsers();
// //       }
// //       setDeleteConfirm(null);
// //     } catch (error) {
// //       toast.error('Delete failed');
// //     }
// //   };

// //   // Called when the modal form is successfully submitted
// //   const handleAddUser = async (data: UserCreateRequest | UserUpdateRequest) => {
// //     setSubmitting(true);
// //     try {
// //       await userApi.create(data as UserCreateRequest);
// //       toast.success('User created successfully');
// //       setIsAddModalOpen(false);
// //       fetchUsers(); // refresh list
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || 'Creation failed');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const filteredUsers = searchTerm
// //     ? users.filter(
// //         (u) =>
// //           u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           u.email.toLowerCase().includes(searchTerm.toLowerCase())
// //       )
// //     : users;

// //   const getRoleBadgeColor = (role: string) => {
// //     switch (role) {
// //       case 'ADMIN': return 'bg-purple-100 text-purple-800';
// //       case 'TEACHER': return 'bg-blue-100 text-blue-800';
// //       case 'STUDENT': return 'bg-green-100 text-green-800';
// //       default: return 'bg-yellow-100 text-yellow-800';
// //     }
// //   };

// //   return (
// //     <Layout>
// //       <div className="p-6 max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
// //           <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
// //           <button
// //             onClick={() => setIsAddModalOpen(true)}
// //             className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //           >
// //             <UserPlusIcon className="h-5 w-5 mr-2" />
// //             Add User
// //           </button>
// //         </div>

// //         {/* Filters and search */}
// //         <div className="mb-6 space-y-4">
// //           <div className="flex flex-wrap gap-2">
// //             <button
// //               onClick={() => setRoleFilter('')}
// //               className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
// //                 roleFilter === ''
// //                   ? 'bg-indigo-100 text-indigo-800'
// //                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //               }`}
// //             >
// //               All
// //             </button>
// //             {ROLES.map((role) => (
// //               <button
// //                 key={role.value}
// //                 onClick={() => setRoleFilter(role.value)}
// //                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
// //                   roleFilter === role.value
// //                     ? 'bg-indigo-100 text-indigo-800'
// //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                 }`}
// //               >
// //                 {role.label}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="relative">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search by name or email..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// //             />
// //             {searchTerm && (
// //               <button
// //                 onClick={() => setSearchTerm('')}
// //                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
// //               >
// //                 <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Users table */}
// //         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
// //           {loading ? (
// //             <div className="p-8 text-center">
// //               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
// //               <p className="mt-2 text-gray-500">Loading users...</p>
// //             </div>
// //           ) : filteredUsers.length === 0 ? (
// //             <div className="p-12 text-center">
// //               <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
// //               <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
// //               <p className="mt-1 text-sm text-gray-500">
// //                 {searchTerm || roleFilter
// //                   ? 'Try adjusting your filters.'
// //                   : 'Get started by creating a new user.'}
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {filteredUsers.map((user) => (
// //                     <tr key={user.id} className="hover:bg-gray-50 transition-colors">
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                         {user.firstName} {user.lastName}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm">
// //                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
// //                           {user.role}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || '-'}</td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 space-x-3">
// //                         <Link
// //                           to={`/admin/users/${user.id}/edit`}
// //                           className="text-indigo-600 hover:text-indigo-900"
// //                           title="Edit user"
// //                         >
// //                           <PencilIcon className="h-5 w-5" />
// //                         </Link>
// //                         <button
// //                           onClick={() => setDeleteConfirm(user.id)}
// //                           className="text-red-600 hover:text-red-900"
// //                           title="Delete user"
// //                         >
// //                           <TrashIcon className="h-5 w-5" />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}

// //           {/* Pagination */}
// //           {totalPages > 1 && (
// //             <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// //               <button
// //                 onClick={() => setPage((p) => Math.max(0, p - 1))}
// //                 disabled={page === 0}
// //                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
// //               >
// //                 Previous
// //               </button>
// //               <span className="text-sm text-gray-700">
// //                 Page {page + 1} of {totalPages}
// //               </span>
// //               <button
// //                 onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
// //                 disabled={page === totalPages - 1}
// //                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Delete confirmation modal */}
// //       {deleteConfirm && (
// //         <div className="absolute background.paper inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg max-w-md w-full">
// //             <div className="px-6 py-4 border-b border-gray-200">
// //               <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
// //             </div>
// //             <div className="px-6 py-4">
// //               <p className="text-sm text-gray-500">
// //                 Are you sure you want to delete this user? This action cannot be undone.
// //               </p>
// //             </div>
// //             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
// //               <button
// //                 onClick={() => setDeleteConfirm(null)}
// //                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={() => handleDelete(deleteConfirm)}
// //                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Add User Modal with hidden scrollbar */}
// //       {isAddModalOpen && (
// //         <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
// //             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
// //               <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
// //               <button
// //                 onClick={() => setIsAddModalOpen(false)}
// //                 className="text-gray-400 hover:text-gray-600"
// //               >
// //                 <XMarkIcon className="h-6 w-6" />
// //               </button>
// //             </div>
// //             <div className="p-6">
// //               <UserForm
// //                 onSubmit={handleAddUser}
// //                 isSubmitting={submitting}
// //                 onCancel={() => setIsAddModalOpen(false)}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Hide scrollbar style definition */}
// //       <style>{`
// //         .hide-scrollbar {
// //           -ms-overflow-style: none;
// //           scrollbar-width: none;
// //         }
// //         .hide-scrollbar::-webkit-scrollbar {
// //           display: none;
// //         }
// //       `}</style>
// //     </Layout>
// //   );
// // };

// // export default UsersList;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   PencilIcon,
//   TrashIcon,
//   UserPlusIcon,
//   MagnifyingGlassIcon,
//   XMarkIcon,
//   UserGroupIcon,
// } from '@heroicons/react/24/outline';
// import { userApi } from '../../api/users';
// import { ROLES } from '../../utils/constants';
// import Layout from '../../component/layout';
// import UserForm from '../../component/users/UserForm';
// import toast from 'react-hot-toast';
// import type { AnyUser, UserCreateRequest, UserUpdateRequest } from '../../types/user';

// const UsersList: React.FC = () => {
//   const [users, setUsers] = useState<AnyUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [roleFilter, setRoleFilter] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

//   // Modal state for adding a user
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Lock body scroll when any modal is open
//   useEffect(() => {
//     if (isAddModalOpen || deleteConfirm) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     // Cleanup when component unmounts
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isAddModalOpen, deleteConfirm]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = roleFilter
//         ? await userApi.getByRole(roleFilter, page, 10)
//         : await userApi.getAll(page, 10);

//       setUsers(response.data?.content ?? []);
//       setTotalPages(response.data?.totalPages ?? 0);
//     } catch (error) {
//       toast.error('Failed to load users');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [page, roleFilter]);

//   const handleDelete = async (id: number) => {
//     try {
//       await userApi.delete(id);
//       toast.success('User deleted successfully');
//       if (users.length === 1 && page > 0) {
//         setPage(page - 1);
//       } else {
//         fetchUsers();
//       }
//       setDeleteConfirm(null);
//     } catch (error) {
//       toast.error('Delete failed');
//     }
//   };

//   const handleAddUser = async (data: UserCreateRequest | UserUpdateRequest) => {
//     setSubmitting(true);
//     try {
//       await userApi.create(data as UserCreateRequest);
//       toast.success('User created successfully');
//       setIsAddModalOpen(false);
//       fetchUsers(); // refresh list
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Creation failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const filteredUsers = searchTerm
//     ? users.filter(
//         (u) =>
//           u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           u.email.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : users;

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case 'ADMIN': return 'bg-purple-100 text-purple-800';
//       case 'TEACHER': return 'bg-blue-100 text-blue-800';
//       case 'STUDENT': return 'bg-green-100 text-green-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <UserPlusIcon className="h-5 w-5 mr-2" />
//             Add User
//           </button>
//         </div>

//         {/* Filters and search */}
//         <div className="mb-6 space-y-4">
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setRoleFilter('')}
//               className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                 roleFilter === ''
//                   ? 'bg-indigo-100 text-indigo-800'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               All
//             </button>
//             {ROLES.map((role) => (
//               <button
//                 key={role.value}
//                 onClick={() => setRoleFilter(role.value)}
//                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                   roleFilter === role.value
//                     ? 'bg-indigo-100 text-indigo-800'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 {role.label}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm('')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Users table */}
//         <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//               <p className="mt-2 text-gray-500">Loading users...</p>
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="p-12 text-center">
//               <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {searchTerm || roleFilter
//                   ? 'Try adjusting your filters.'
//                   : 'Get started by creating a new user.'}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {user.firstName} {user.lastName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || '-'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 space-x-3">
//                         <Link
//                           to={`/admin/users/${user.id}/edit`}
//                           className="text-indigo-600 hover:text-indigo-900"
//                           title="Edit user"
//                         >
//                           <PencilIcon className="h-5 w-5" />
//                         </Link>
//                         <button
//                           onClick={() => setDeleteConfirm(user.id)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete user"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
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


// {/* <div
//     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//     onClick={() => setDeleteConfirm(null)}
//   >
//     <div
//       className="bg-white rounded-lg max-w-md w-full"
//       onClick={(e) => e.stopPropagation()}
//     > */}
//       {/* Delete confirmation modal */}
//       {deleteConfirm && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setDeleteConfirm(null)} // close on backdrop click
//         >
//           <div
//             className="bg-white rounded-lg max-w-md w-full"
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//           >
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
//             </div>
//             <div className="px-6 py-4">
//               <p className="text-sm text-gray-500">
//                 Are you sure you want to delete this user? This action cannot be undone.
//               </p>
//             </div>
//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add User Modal */}
//       {isAddModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setIsAddModalOpen(false)} // close on backdrop click
//         >
//           <div
//             className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//           >
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
//               <button
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="p-6">
//               <UserForm
//                 onSubmit={handleAddUser}
//                 isSubmitting={submitting}
//                 onCancel={() => setIsAddModalOpen(false)}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hide scrollbar style definition */}
//       <style>{`
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </Layout>
//   );
// };

// export default UsersList;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { userApi } from '../../api/users';
import { ROLES } from '../../utils/constants';
import Layout from '../../component/layout';
import UserForm from '../../component/users/UserForm';
import toast from 'react-hot-toast';
import type { AnyUser, UserCreateRequest, UserUpdateRequest } from '../../types/user';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<AnyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AnyUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isAddModalOpen || deleteConfirm || editUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen, deleteConfirm, editUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = roleFilter
        ? await userApi.getByRole(roleFilter, page, 10)
        : await userApi.getAll(page, 10);

      setUsers(response.data?.content ?? []);
      setTotalPages(response.data?.totalPages ?? 0);
    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleDelete = async (id: number) => {
    try {
      await userApi.delete(id);
      toast.success('User deleted successfully');
      if (users.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchUsers();
      }
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleAddUser = async (data: UserCreateRequest | UserUpdateRequest) => {
    setSubmitting(true);
    try {
      await userApi.create(data as UserCreateRequest);
      toast.success('User created successfully');
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async (data: UserCreateRequest | UserUpdateRequest) => {
    if (!editUser) return;
    setSubmitting(true);
    try {
      await userApi.update(editUser.id, data as UserUpdateRequest);
      toast.success('User updated successfully');
      setEditUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'TEACHER': return 'bg-blue-100 text-blue-800';
      case 'STUDENT': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Filters and search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRoleFilter('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                roleFilter === ''
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {ROLES.map((role) => (
              <button
                key={role.value}
                onClick={() => setRoleFilter(role.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  roleFilter === role.value
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter
                  ? 'Try adjusting your filters.'
                  : 'Get started by creating a new user.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 space-x-3">
                        <button
                          onClick={() => setEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit user"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
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

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <UserForm
                onSubmit={handleAddUser}
                isSubmitting={submitting}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditUser(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <UserForm
                initialData={editUser}
                onSubmit={handleEditUser}
                isSubmitting={submitting}
                onCancel={() => setEditUser(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbar style definition */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Layout>
  );
};

export default UsersList;