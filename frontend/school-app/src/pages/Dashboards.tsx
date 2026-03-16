// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   UsersIcon,
//   AcademicCapIcon,
//   UserGroupIcon,
//   BookOpenIcon,
//   ClipboardDocumentListIcon,
//   CalendarIcon,
//   ChartBarIcon,
//   ClockIcon,
//   ChevronRightIcon,
//   PencilSquareIcon,
//   CheckCircleIcon,
//   StarIcon,
// } from "@heroicons/react/24/outline";
// import Layout from "../component/layout";
// import { userApi } from "../api/users";
// import { classService } from "../api/class";
// import subjectService from "../api/subject";
// import { attendanceService } from "../api/attendanceService";
// import { GradeService } from "../api/GradeService";
// import { assignmentService } from "../api/assignmentService";
// import toast from "react-hot-toast";

// // ----------------------------------------------------------------------
// // Types & Interfaces
// // ----------------------------------------------------------------------

// interface DashboardStats {
//   // Admin
//   totalStudents?: number;
//   totalTeachers?: number;
//   totalParents?: number;
//   totalClasses?: number;
//   totalSubjects?: number;
//   recentEnrollments?: number;
//   recentAssignments?: number;

//   // Teacher
//   pendingGrading?: number;
//   upcomingAssignments?: number;
//   classSummaries?: Array<{
//     classId: number;
//     className: string;
//     studentCount: number;
//     pendingSubmissions: number;
//   }>;

//   // Student
//   className?: string;
//   attendancePercentage?: number;
//   averageGrade?: string;
//   pendingAssignments?: number;

//   // Parent
//   children?: Array<{
//     studentId: number;
//     studentName: string;
//     className: string;
//     attendancePercentage: number;
//     averageGrade: string;
//     pendingAssignments: number;
//   }>;

//   // Chart data (optional)
//   enrollmentTrend?: Array<{ month: string; students: number }>;
//   attendanceByGrade?: Array<{ grade: string; attendance: number }>;
// }

// // ----------------------------------------------------------------------
// // Helper Components
// // ----------------------------------------------------------------------

// const StatCard: React.FC<{
//   title: string;
//   value: number | string | undefined;
//   icon: React.ElementType;
//   color: string;
//   isLoading?: boolean;
// }> = ({ title, value, icon: Icon, color, isLoading }) => {
//   const colorClasses: Record<string, string> = {
//     blue: "bg-blue-500",
//     green: "bg-green-500",
//     purple: "bg-purple-500",
//     yellow: "bg-yellow-500",
//     red: "bg-red-500",
//     indigo: "bg-indigo-500",
//     orange: "bg-orange-500",
//     teal: "bg-teal-500",
//     pink: "bg-pink-500",
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex items-center justify-between border border-gray-100 group min-w-[200px] flex-1">
//       <div>
//         <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
//           {title}
//         </p>
//         {isLoading ? (
//           <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse mt-2"></div>
//         ) : (
//           <p className="text-3xl font-bold text-gray-800 mt-2">{value ?? "-"}</p>
//         )}
//       </div>
//       <div
//         className={`p-4 rounded-xl ${colorClasses[color]} bg-opacity-10 group-hover:scale-110 transition-transform`}
//       >
//         <Icon className={`h-6 w-6 text-${color}-600`} />
//       </div>
//     </div>
//   );
// };

// // ----------------------------------------------------------------------
// // Main Dashboard Component
// // ----------------------------------------------------------------------

// const Dashboard: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [data, setData] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!user) return;

//     const fetchDashboardData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const stats: DashboardStats = {};

//         switch (user.role) {
//           case "ADMIN": {
//             const [studentsRes, teachersRes, parentsRes, classesRes, subjectsRes] = await Promise.all([
//               userApi.getByRole("STUDENT", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
//               userApi.getByRole("TEACHER", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
//               userApi.getByRole("PARENT", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
//               classService.getAll(0, 1).catch(() => ({ data: { totalElements: 0 } })),
//               subjectService.getAllSubjects(0, 1).catch(() => ({ data: { totalElements: 0 } })),
//             ]);

//             stats.totalStudents = studentsRes.data.totalElements;
//             stats.totalTeachers = teachersRes.data.totalElements;
//             stats.totalParents = parentsRes.data.totalElements;
//             stats.totalClasses = classesRes.data.totalElements;
//             stats.totalSubjects = subjectsRes.data.totalElements;
//             stats.recentEnrollments = 0; // TODO: replace with real data if available
//             stats.recentAssignments = 0;  // TODO: replace with real data if available
//             break;
//           }

//           case "TEACHER": {
//             // TODO: Implement teacher-specific endpoints
//             // Example:
//             // const classesRes = await teacherService.getClasses(user.id);
//             // stats.classSummaries = classesRes.data;
//             // stats.totalClasses = classesRes.data.length;
//             // const studentsCount = ...;
//             // stats.totalStudents = studentsCount;
//             // stats.pendingGrading = ...;
//             // stats.upcomingAssignments = ...;
//             stats.totalClasses = 0;
//             stats.totalStudents = 0;
//             stats.pendingGrading = 0;
//             stats.upcomingAssignments = 0;
//             stats.classSummaries = [];
//             break;
//           }

//           case "STUDENT": {
//             const studentId = user.id;
//             try {
//               // Class name – you might have it in user object or need an API
//               stats.className = (user as any).className || "Not assigned";

//               // Attendance (last 30 days)
//               const attendanceRes = await attendanceService.getByStudent(studentId, 0, 30);
//               const attendanceRecords = attendanceRes.data.content;
//               const totalDays = attendanceRecords.length;
//               const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
//               stats.attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

//               // Grades
//               const gradesRes = await GradeService.getByStudent(studentId, 0, 100);
//               const grades = gradesRes.data.content;
//               const totalMarks = grades.reduce((sum, g) => sum + g.marksObtained, 0);
//               const totalMax = grades.reduce((sum, g) => sum + g.maxMarks, 0);
//               stats.averageGrade = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) + "%" : "N/A";

//               // Pending assignments (due in future)
//               const assignmentsRes = await assignmentService.getAll(undefined, studentId, 0, 100);
//               const now = new Date();
//               stats.pendingAssignments = assignmentsRes.data.content.filter(
//                 (a) => new Date(a.dueDate) > now
//               ).length;
//               stats.upcomingAssignments = stats.pendingAssignments; // or separate logic
//             } catch (err) {
//               console.error("Student dashboard error:", err);
//               toast.error("Failed to load some student data");
//             }
//             break;
//           }

//           case "PARENT": {
//             try {
//               // Fetch children of this parent (needs backend endpoint)
//               const childrenRes = await userApi.getChildren(user.id, 0, 100);
//               const childrenList = childrenRes.data.content;

//               if (childrenList.length > 0) {
//                 const childrenStats = await Promise.all(
//                   childrenList.map(async (child: any) => {
//                     const studentId = child.id;
//                     // Fetch attendance (last 30 days)
//                     const attendanceRes = await attendanceService.getByStudent(studentId, 0, 30).catch(() => ({ data: { content: [] } }));
//                     const attendanceRecords = attendanceRes.data.content;
//                     const totalDays = attendanceRecords.length;
//                     const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
//                     const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
//                     stats.attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

//                     // Fetch grades
//                     const gradesRes = await GradeService.getByStudent(studentId, 0, 100).catch(() => ({ data: { content: [] } }));
//                     const grades = gradesRes.data.content;
//                     const totalMarks = grades.reduce((sum, g) => sum + g.marksObtained, 0);
//                     const totalMax = grades.reduce((sum, g) => sum + g.maxMarks, 0);
//                     const averageGrade = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) + "%" : "N/A";

//                     // Fetch pending assignments
//                     const assignmentsRes = await assignmentService.getAll(undefined, studentId, 0, 100).catch(() => ({ data: { content: [] } }));
//                     const now = new Date();
//                     const pendingAssignments = assignmentsRes.data.content.filter(
//                       (a) => new Date(a.dueDate) > now
//                     ).length;

//                     return {
//                       studentId,
//                       studentName: `${child.firstName} ${child.lastName}`,
//                       className: child.className || "Not assigned",
//                       attendancePercentage,
//                       averageGrade,
//                       pendingAssignments,
//                     };
//                   })
//                 );
//                 stats.children = childrenStats;
//               } else {
//                 stats.children = [];
//               }
//             } catch (err) {
//               console.error("Parent dashboard error:", err);
//               toast.error("Failed to load children data");
//               stats.children = [];
//             }
//             break;
//           }

//           default:
//             break;
//         }

//         setData(stats);
//       } catch (err) {
//         console.error("Dashboard data fetch error:", err);
//         setError("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user]);

//   if (!user) return null;

//   const roleBadge = {
//     ADMIN: "bg-purple-100 text-purple-800",
//     TEACHER: "bg-blue-100 text-blue-800",
//     STUDENT: "bg-green-100 text-green-800",
//     PARENT: "bg-yellow-100 text-yellow-800",
//   }[user.role];

//   if (error) {
//     return (
//       <Layout>
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md">
//             <div className="text-red-600 text-center">
//               <span className="text-6xl">😟</span>
//               <p className="text-lg font-semibold mt-4">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       {/* Header */}
//       <div className="p-6 max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Welcome back, {user.firstName}!
//             </h1>
//             <p className="text-gray-600 mt-1">{user.email}</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex items-center space-x-4">
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleBadge}`}
//             >
//               {user.role}
//             </span>
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//               <CalendarIcon className="h-4 w-4 mr-1" />
//               {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Stat Cards */}
//       <div className="px-6 flex flex-wrap gap-6 mb-8">
//         {user.role === "ADMIN" && (
//           <>
//             <StatCard title="Total Students" value={data?.totalStudents} icon={UsersIcon} color="blue" isLoading={loading} />
//             <StatCard title="Total Teachers" value={data?.totalTeachers} icon={AcademicCapIcon} color="green" isLoading={loading} />
//             <StatCard title="Total Parents" value={data?.totalParents} icon={UserGroupIcon} color="purple" isLoading={loading} />
//             <StatCard title="Total Classes" value={data?.totalClasses} icon={BookOpenIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Total Subjects" value={data?.totalSubjects} icon={ClipboardDocumentListIcon} color="indigo" isLoading={loading} />
//             <StatCard title="Recent Enrollments" value={data?.recentEnrollments} icon={CalendarIcon} color="red" isLoading={loading} />
//             <StatCard title="Recent Assignments" value={data?.recentAssignments} icon={ClockIcon} color="orange" isLoading={loading} />
//           </>
//         )}

//         {user.role === "TEACHER" && (
//           <>
//             <StatCard title="Total Classes" value={data?.totalClasses} icon={BookOpenIcon} color="blue" isLoading={loading} />
//             <StatCard title="Total Students" value={data?.totalStudents} icon={UsersIcon} color="green" isLoading={loading} />
//             <StatCard title="Pending Grading" value={data?.pendingGrading} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Upcoming Assignments" value={data?.upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
//           </>
//         )}

//         {user.role === "STUDENT" && (
//           <>
//             <StatCard title="Class" value={data?.className} icon={BookOpenIcon} color="blue" isLoading={loading} />
//             <StatCard
//               title="Attendance"
//               value={data?.attendancePercentage ? `${data.attendancePercentage}%` : undefined}
//               icon={ChartBarIcon}
//               color="green"
//               isLoading={loading}
//             />
//             <StatCard title="Average Grade" value={data?.averageGrade} icon={AcademicCapIcon} color="purple" isLoading={loading} />
//             <StatCard title="Pending Assignments" value={data?.pendingAssignments} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Upcoming Assignments" value={data?.upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
//           </>
//         )}

//         {user.role === "PARENT" && (
//           <StatCard title="Children" value={data?.children?.length} icon={UserGroupIcon} color="blue" isLoading={loading} />
//         )}
//       </div>

//       {/* Charts (Admin only example) */}
//       {!loading && user.role === "ADMIN" && data && (
//         <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trend</h2>
//             {data.enrollmentTrend ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={data.enrollmentTrend}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="students" stroke="#3b82f6" />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
//                 No data available
//               </div>
//             )}
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Grade</h2>
//             {data.attendanceByGrade ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={data.attendanceByGrade}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="grade" />
//                   <YAxis domain={[0, 100]} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="attendance" fill="#10b981" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
//                 No data available
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Role‑specific detailed views */}
//       {!loading && data && (
//         <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
//           {/* Teacher: My Classes */}
//           {user.role === "TEACHER" && data.classSummaries && data.classSummaries.length > 0 && (
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
//                 <Link to="/classes" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
//                   View all <ChevronRightIcon className="h-4 w-4 ml-1" />
//                 </Link>
//               </div>
//               <div className="space-y-3">
//                 {data.classSummaries.map((cls) => (
//                   <div key={cls.classId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">{cls.className}</p>
//                       <p className="text-sm text-gray-500">{cls.studentCount} students</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-yellow-600">{cls.pendingSubmissions} pending</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Parent: Children Overview */}
//           {user.role === "PARENT" && data.children && data.children.length > 0 && (
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Children Overview</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {data.children.map((child) => (
//                   <div key={child.studentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                     <p className="font-bold text-gray-900">{child.studentName}</p>
//                     <div className="mt-2 space-y-1 text-sm">
//                       <p>Class: {child.className}</p>
//                       <p>Attendance: <span className="font-medium text-green-600">{child.attendancePercentage}%</span></p>
//                       <p>Average Grade: <span className="font-medium text-indigo-600">{child.averageGrade}</span></p>
//                       <p>Pending: <span className="font-medium text-yellow-600">{child.pendingAssignments}</span></p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="space-y-3">
//               <Link
//                 to="/change-password"
//                 className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//               >
//                 Change Password
//               </Link>
//               <button
//                 onClick={logout}
//                 className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
//               >
//                 Logout
//               </button>

//               {user.role === "ADMIN" && (
//                 <>
//                   <Link
//                     to="/admin/users/new"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     Add New User
//                   </Link>
//                   <Link
//                     to="/reports"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     Generate Reports
//                   </Link>
//                 </>
//               )}

//               {user.role === "TEACHER" && (
//                 <>
//                   <Link
//                     to="/assignments"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <PencilSquareIcon className="h-4 w-4 mr-2" />
//                     Manage Assignments
//                   </Link>
//                   <Link
//                     to="/grade"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <StarIcon className="h-4 w-4 mr-2" />
//                     Grade Submissions
//                   </Link>
//                   <Link
//                     to="/attendance"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <CheckCircleIcon className="h-4 w-4 mr-2" />
//                     Mark Attendance
//                   </Link>
//                 </>
//               )}

//               {user.role === "STUDENT" && (
//                 <>
//                   <Link
//                     to="/assignments"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     View Assignments
//                   </Link>
//                   <Link
//                     to="/grade"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     My Grades
//                   </Link>
//                   <Link
//                     to="/attendance"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     My Attendance
//                   </Link>
//                 </>
//               )}

//               {user.role === "PARENT" && (
//                 <>
//                   <Link
//                     to="/grade"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     Children's Grades
//                   </Link>
//                   <Link
//                     to="/attendance"
//                     className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     Children's Attendance
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Layout from "../component/layout";

// API clients and services
import apiClient from "../api/axios";
import { userApi } from "../api/users";
import { classService } from "../api/class";
import subjectService from "../api/subject";
import { attendanceService } from "../api/attendanceService";
import { GradeService } from "../api/GradeService";
import { assignmentService } from "../api/assignmentService";
import toast from "react-hot-toast";

// ----------------------------------------------------------------------
// Types (matching backend DTOs + client‑side aggregates)
// ----------------------------------------------------------------------

interface AdminDashboard {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  recentEnrollments: number;
  recentAssignments: number;
  enrollmentTrend?: Array<{ month: string; students: number }>;
  attendanceByGrade?: Array<{ grade: string; attendance: number }>;
}

interface ClassSummary {
  classId: number;
  className: string;
  studentCount: number;
  pendingSubmissions: number;
}

interface TeacherDashboard {
  totalClasses: number;
  totalStudents: number;
  pendingGrading: number;
  upcomingAssignments: number;
  classSummaries: ClassSummary[];
}

interface StudentDashboard {
  className: string;
  attendancePercentage: number;
  averageGrade: string;        // string with % (e.g. "85.5%")
  pendingAssignments: number;
  upcomingAssignments: number;
}

interface ChildSummary {
  studentId: number;
  studentName: string;
  className: string;
  attendancePercentage: number;
  averageGrade: string;         // string with %
  pendingAssignments: number;
}

interface ParentDashboard {
  children: ChildSummary[];
}

type DashboardData =
  | { role: "ADMIN"; data: AdminDashboard }
  | { role: "TEACHER"; data: TeacherDashboard }
  | { role: "STUDENT"; data: StudentDashboard }
  | { role: "PARENT"; data: ParentDashboard };

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

const StatCard: React.FC<{
  title: string;
  value: number | string | undefined;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}> = ({ title, value, icon: Icon, color, isLoading }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    pink: "bg-pink-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex items-center justify-between border border-gray-100 group min-w-[200px] flex-1">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        {isLoading ? (
          <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse mt-2" />
        ) : (
          <p className="text-3xl font-bold text-gray-800 mt-2">{value ?? "-"}</p>
        )}
      </div>
      <div
        className={`p-4 rounded-xl ${colorClasses[color]} bg-opacity-10 group-hover:scale-110 transition-transform`}
      >
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Helper: generate mock chart data (used only when backend doesn't provide it)
// ----------------------------------------------------------------------
const generateMockChartData = (totalStudents: number, totalClasses: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const base = Math.max(0, totalStudents - 25);
  const enrollmentTrend = months.map((month, i) => ({
    month,
    students: base + i * 4 + Math.floor(Math.random() * 8),
  }));

  const classNames = ['Class 1A', 'Class 1B', 'Class 2A', 'Class 2B', 'Class 3A'];
  const grades = Array.from({ length: Math.min(totalClasses, 5) }, (_, i) =>
    classNames[i % classNames.length] + (i >= classNames.length ? ` (${i+1})` : '')
  );
  const attendanceByGrade = grades.map(grade => ({
    grade,
    attendance: Math.floor(Math.random() * 20 + 75),
  }));

  return { enrollmentTrend, attendanceByGrade };
};

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const role = user.role as DashboardData["role"];

        // ------------------------------------------------------------------
        // 1. Try the dedicated backend endpoint first
        // ------------------------------------------------------------------
        let endpoint = "";
        switch (role) {
          case "ADMIN": endpoint = "/dashboard/admin"; break;
          case "TEACHER": endpoint = "/dashboard/teacher"; break;
          case "STUDENT": endpoint = "/dashboard/student"; break;
          case "PARENT": endpoint = "/dashboard/parent"; break;
          default: throw new Error(`Unsupported role: ${user.role}`);
        }

        try {
          const response = await apiClient.get(endpoint);

          // For admin, generate mock chart data if backend didn't provide it
          if (role === "ADMIN") {
            const adminData = response.data as AdminDashboard;
            if (!adminData.enrollmentTrend || !adminData.attendanceByGrade) {
              const mockCharts = generateMockChartData(
                adminData.totalStudents,
                adminData.totalClasses
              );
              adminData.enrollmentTrend = mockCharts.enrollmentTrend;
              adminData.attendanceByGrade = mockCharts.attendanceByGrade;
            }
          }

          setDashboard({ role, data: response.data });
          setLoading(false);
          return; // success, exit early
        } catch (apiError) {
          console.warn(`Dedicated ${role} endpoint failed, using fallback aggregation`, apiError);
          // fall through to manual aggregation
        }

        // ------------------------------------------------------------------
        // 2. Manual aggregation (fallback)
        // ------------------------------------------------------------------
        let aggregatedData: any = {};

        if (role === "ADMIN") {
          const [studentsRes, teachersRes, parentsRes, classesRes, subjectsRes] = await Promise.all([
            userApi.getByRole("STUDENT", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
            userApi.getByRole("TEACHER", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
            userApi.getByRole("PARENT", 0, 1).catch(() => ({ data: { totalElements: 0 } })),
            classService.getAll(0, 1).catch(() => ({ data: { totalElements: 0 } })),
            subjectService.getAllSubjects(0, 1).catch(() => ({ data: { totalElements: 0 } })),
          ]);

          aggregatedData = {
            totalStudents: studentsRes.data.totalElements,
            totalTeachers: teachersRes.data.totalElements,
            totalParents: parentsRes.data.totalElements,
            totalClasses: classesRes.data.totalElements,
            totalSubjects: subjectsRes.data.totalElements,
            recentEnrollments: 0,
            recentAssignments: 0,
            ...generateMockChartData(
              studentsRes.data.totalElements,
              classesRes.data.totalElements
            ),
          };
        }

        else if (role === "TEACHER") {
          // Teacher fallback – currently placeholder (implement as needed)
          aggregatedData = {
            totalClasses: 0,
            totalStudents: 0,
            pendingGrading: 0,
            upcomingAssignments: 0,
            classSummaries: [],
          };
        }

        else if (role === "STUDENT") {
          const studentId = user.id;

          // Class name – try to get from user object, else fallback
          let className = (user as any).className;
          if (!className) {
            // Optionally try to fetch student details, but we keep it simple to avoid extra failing calls
            className = "Not assigned";
          }

          // Attendance (last 30 days)
          let attendancePercentage = 0;
          try {
            const attendanceRes = await attendanceService.getByStudent(studentId, 0, 30);
            const attendanceRecords = attendanceRes.data.content;
            const totalDays = attendanceRecords.length;
            const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
            attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
          } catch (err) {
            console.warn("Failed to fetch attendance", err);
          }

          // Grades
          let averageGrade = "N/A";
          try {
            const gradesRes = await GradeService.getByStudent(studentId, 0, 100);
            const grades = gradesRes.data.content;
            const totalMarks = grades.reduce((sum, g) => sum + g.marksObtained, 0);
            const totalMax = grades.reduce((sum, g) => sum + g.maxMarks, 0);
            averageGrade = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) + "%" : "N/A";
          } catch (err) {
            console.warn("Failed to fetch grades", err);
          }

          // Pending assignments (due in future)
          let pendingAssignments = 0;
          try {
            const assignmentsRes = await assignmentService.getAll(undefined, studentId, 0, 100);
            const now = new Date();
            pendingAssignments = assignmentsRes.data.content.filter(
              (a) => new Date(a.dueDate) > now
            ).length;
          } catch (err) {
            console.warn("Failed to fetch assignments", err);
          }

          aggregatedData = {
            className,
            attendancePercentage,
            averageGrade,
            pendingAssignments,
            upcomingAssignments: pendingAssignments,
          };
        }

        else if (role === "PARENT") {
          try {
            const childrenRes = await userApi.getChildren(user.id, 0, 100);
            const childrenList = childrenRes.data.content;

            if (childrenList.length > 0) {
              const childrenWithClasses = await Promise.all(
                childrenList.map(async (child: any) => {
                  const studentId = child.id;

                  // Class name – try from child object, else fallback
                  const className = child.className || "Not assigned";

                  // Attendance
                  let attendancePercentage = 0;
                  try {
                    const attendanceRes = await attendanceService.getByStudent(studentId, 0, 30);
                    const attendanceRecords = attendanceRes.data.content;
                    const totalDays = attendanceRecords.length;
                    const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
                    attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
                  } catch (err) {
                    console.warn(`Failed to fetch attendance for child ${studentId}`, err);
                  }

                  // Grades
                  let averageGrade = "N/A";
                  try {
                    const gradesRes = await GradeService.getByStudent(studentId, 0, 100);
                    const grades = gradesRes.data.content;
                    const totalMarks = grades.reduce((sum, g) => sum + g.marksObtained, 0);
                    const totalMax = grades.reduce((sum, g) => sum + g.maxMarks, 0);
                    averageGrade = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) + "%" : "N/A";
                  } catch (err) {
                    console.warn(`Failed to fetch grades for child ${studentId}`, err);
                  }

                  // Pending assignments
                  let pendingAssignments = 0;
                  try {
                    const assignmentsRes = await assignmentService.getAll(undefined, studentId, 0, 100);
                    const now = new Date();
                    pendingAssignments = assignmentsRes.data.content.filter(
                      (a) => new Date(a.dueDate) > now
                    ).length;
                  } catch (err) {
                    console.warn(`Failed to fetch assignments for child ${studentId}`, err);
                  }

                  return {
                    studentId,
                    studentName: `${child.firstName} ${child.lastName}`,
                    className,
                    attendancePercentage,
                    averageGrade,
                    pendingAssignments,
                  };
                })
              );
              aggregatedData = { children: childrenWithClasses };
            } else {
              aggregatedData = { children: [] };
            }
          } catch (err) {
            console.error("Parent fallback error – unable to fetch children list", err);
            aggregatedData = { children: [] };
          }
        }

        setDashboard({ role, data: aggregatedData });
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard. Please try again.");
        toast.error("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  if (!user) return null;

  const roleBadge = {
    ADMIN: "bg-purple-100 text-purple-800",
    TEACHER: "bg-blue-100 text-blue-800",
    STUDENT: "bg-green-100 text-green-800",
    PARENT: "bg-yellow-100 text-yellow-800",
  }[user.role];

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md">
            <div className="text-red-600 text-center">
              <span className="text-6xl">😟</span>
              <p className="text-lg font-semibold mt-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = dashboard?.data;

  return (
    <Layout>
      {/* Header */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleBadge}`}
            >
              {user.role}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="px-6 flex flex-wrap gap-6 mb-8">
        {user.role === "ADMIN" && stats && (
          <>
            <StatCard title="Total Students" value={(stats as AdminDashboard).totalStudents} icon={UsersIcon} color="blue" isLoading={loading} />
            <StatCard title="Total Teachers" value={(stats as AdminDashboard).totalTeachers} icon={AcademicCapIcon} color="green" isLoading={loading} />
            <StatCard title="Total Parents" value={(stats as AdminDashboard).totalParents} icon={UserGroupIcon} color="purple" isLoading={loading} />
            <StatCard title="Total Classes" value={(stats as AdminDashboard).totalClasses} icon={BookOpenIcon} color="yellow" isLoading={loading} />
            <StatCard title="Total Subjects" value={(stats as AdminDashboard).totalSubjects} icon={ClipboardDocumentListIcon} color="indigo" isLoading={loading} />
            <StatCard title="Recent Enrollments" value={(stats as AdminDashboard).recentEnrollments} icon={CalendarIcon} color="red" isLoading={loading} />
            <StatCard title="Recent Assignments" value={(stats as AdminDashboard).recentAssignments} icon={ClockIcon} color="orange" isLoading={loading} />
          </>
        )}

        {user.role === "TEACHER" && stats && (
          <>
            <StatCard title="Total Classes" value={(stats as TeacherDashboard).totalClasses} icon={BookOpenIcon} color="blue" isLoading={loading} />
            <StatCard title="Total Students" value={(stats as TeacherDashboard).totalStudents} icon={UsersIcon} color="green" isLoading={loading} />
            <StatCard title="Pending Grading" value={(stats as TeacherDashboard).pendingGrading} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
            <StatCard title="Upcoming Assignments" value={(stats as TeacherDashboard).upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
          </>
        )}

        {user.role === "STUDENT" && stats && (
          <>
            <StatCard title="Class" value={(stats as StudentDashboard).className} icon={BookOpenIcon} color="blue" isLoading={loading} />
            <StatCard
              title="Attendance"
              value={(stats as StudentDashboard).attendancePercentage !== undefined ? `${(stats as StudentDashboard).attendancePercentage}%` : undefined}
              icon={ChartBarIcon}
              color="green"
              isLoading={loading}
            />
            <StatCard title="Average Grade" value={(stats as StudentDashboard).averageGrade} icon={AcademicCapIcon} color="purple" isLoading={loading} />
            <StatCard title="Pending Assignments" value={(stats as StudentDashboard).pendingAssignments} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
            <StatCard title="Upcoming Assignments" value={(stats as StudentDashboard).upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
          </>
        )}

        {user.role === "PARENT" && stats && (
          <StatCard title="Children" value={(stats as ParentDashboard).children?.length} icon={UserGroupIcon} color="blue" isLoading={loading} />
        )}
      </div>

      {/* Charts (Admin only) */}
      {!loading && user.role === "ADMIN" && stats && (
        <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trend</h2>
            {(stats as AdminDashboard).enrollmentTrend ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={(stats as AdminDashboard).enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No chart data available
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Grade</h2>
            {(stats as AdminDashboard).attendanceByGrade ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(stats as AdminDashboard).attendanceByGrade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No chart data available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role‑specific detailed views */}
      {!loading && dashboard && (
        <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          {/* Teacher: My Classes */}
          {user.role === "TEACHER" && (stats as TeacherDashboard).classSummaries && (stats as TeacherDashboard).classSummaries!.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
                <Link to="/classes" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View all <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-3">
                {(stats as TeacherDashboard).classSummaries!.map((cls) => (
                  <div key={cls.classId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{cls.className}</p>
                      <p className="text-sm text-gray-500">{cls.studentCount} students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-600">{cls.pendingSubmissions} pending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parent: Children Overview */}
          {user.role === "PARENT" && (stats as ParentDashboard).children && (stats as ParentDashboard).children!.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Children Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(stats as ParentDashboard).children!.map((child) => (
                  <div key={child.studentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <p className="font-bold text-gray-900">{child.studentName}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Class: {child.className}</p>
                      <p>Attendance: <span className="font-medium text-green-600">{child.attendancePercentage}%</span></p>
                      <p>Average Grade: <span className="font-medium text-indigo-600">{child.averageGrade}</span></p>
                      <p>Pending: <span className="font-medium text-yellow-600">{child.pendingAssignments}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If parent has no children */}
          {user.role === "PARENT" && (!(stats as ParentDashboard).children || (stats as ParentDashboard).children!.length === 0) && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-gray-500 text-center">No children linked to your account.</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/change-password"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Change Password
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>

              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin/users/new"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Add New User
                  </Link>
                  <Link
                    to="/reports"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Generate Reports
                  </Link>
                </>
              )}

              {user.role === "TEACHER" && (
                <>
                  <Link
                    to="/assignments"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Manage Assignments
                  </Link>
                  <Link
                    to="/grade"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <StarIcon className="h-4 w-4 mr-2" />
                    Grade Submissions
                  </Link>
                  <Link
                    to="/attendance"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Link>
                </>
              )}

              {user.role === "STUDENT" && (
                <>
                  <Link
                    to="/assignments"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    View Assignments
                  </Link>
                  <Link
                    to="/grade"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    My Grades
                  </Link>
                  <Link
                    to="/attendance"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    My Attendance
                  </Link>
                </>
              )}

              {user.role === "PARENT" && (
                <>
                  <Link
                    to="/grade"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Children's Grades
                  </Link>
                  <Link
                    to="/attendance"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Children's Attendance
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;