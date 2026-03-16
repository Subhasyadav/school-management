// // const Dashboard = () => {
// //   return <h2>User Dashboard</h2>;
// // };

// // export default Dashboard;


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
// import apiClient from "../api/axios";
// import toast from "react-hot-toast";

// // ----------------------------------------------------------------------
// // Types (matching backend DTOs)
// // ----------------------------------------------------------------------

// interface AdminDashboard {
//   totalStudents: number;
//   totalTeachers: number;
//   totalParents: number;
//   totalClasses: number;
//   totalSubjects: number;
//   recentEnrollments: number;
//   recentAssignments: number;
//   enrollmentTrend?: Array<{ month: string; students: number }>;
//   attendanceByGrade?: Array<{ grade: string; attendance: number }>;
// }

// interface ClassSummary {
//   classId: number;
//   className: string;
//   studentCount: number;
//   pendingSubmissions: number;
// }

// interface TeacherDashboard {
//   totalClasses: number;
//   totalStudents: number;
//   pendingGrading: number;
//   upcomingAssignments: number;
//   classSummaries: ClassSummary[];
// }

// interface StudentDashboard {
//   className: string;
//   attendancePercentage: number;
//   averageGrade: number;
//   pendingAssignments: number;
//   upcomingAssignments: number;
// }

// interface ChildSummary {
//   studentId: number;
//   studentName: string;
//   className: string;
//   attendancePercentage: number;
//   averageGrade: number;
//   pendingAssignments: number;
// }

// interface ParentDashboard {
//   children: ChildSummary[];
// }

// type DashboardData =
//   | { role: "ADMIN"; data: AdminDashboard }
//   | { role: "TEACHER"; data: TeacherDashboard }
//   | { role: "STUDENT"; data: StudentDashboard }
//   | { role: "PARENT"; data: ParentDashboard };

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
//   classSummaries?: ClassSummary[];

//   // Student
//   className?: string;
//   attendancePercentage?: number;
//   averageGrade?: number;
//   pendingAssignments?: number;

//   // Parent
//   children?: ChildSummary[];

//   // Chart data
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
//           <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse mt-2" />
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
// // Helper to generate mock chart data (scaled with actual counts)
// // ----------------------------------------------------------------------
// const generateMockChartData = (totalStudents: number, totalClasses: number) => {
//   // Enrollment trend: last 6 months, start from a base and increase gradually
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
//   const base = Math.max(0, totalStudents - 25);
//   const enrollmentTrend = months.map((month, i) => ({
//     month,
//     students: base + i * 4 + Math.floor(Math.random() * 8),
//   }));

//   // Attendance by grade: use actual class count to create plausible class names
//   const classNames = ['Class 1A', 'Class 1B', 'Class 2A', 'Class 2B', 'Class 3A'];
//   // If we have fewer classes, slice; if more, repeat
//   const grades = Array.from({ length: Math.min(totalClasses, 5) }, (_, i) => 
//     classNames[i % classNames.length] + (i >= classNames.length ? ` (${i+1})` : '')
//   );
//   const attendanceByGrade = grades.map(grade => ({
//     grade,
//     attendance: Math.floor(Math.random() * 20 + 75), // 75-95%
//   }));

//   return { enrollmentTrend, attendanceByGrade };
// };

// // ----------------------------------------------------------------------
// // Main Dashboard Component
// // ----------------------------------------------------------------------

// const Dashboard: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [dashboard, setDashboard] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const stats: DashboardStats = dashboard
//     ? (() => {
//         if (dashboard.role === "ADMIN") {
//           return { ...dashboard.data };
//         }
//         if (dashboard.role === "TEACHER") {
//           return { ...dashboard.data };
//         }
//         if (dashboard.role === "STUDENT") {
//           return {
//             className: dashboard.data.className,
//             attendancePercentage: dashboard.data.attendancePercentage,
//             averageGrade: dashboard.data.averageGrade,
//             pendingAssignments: dashboard.data.pendingAssignments,
//             upcomingAssignments: dashboard.data.upcomingAssignments,
//           };
//         }
//         if (dashboard.role === "PARENT") {
//           return {
//             children: dashboard.data.children,
//           };
//         }
//         return {};
//       })()
//     : {};

//   useEffect(() => {
//     if (!user) return;

//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         let endpoint = "";
//         let role = user.role as DashboardData["role"];

//         switch (role) {
//           case "ADMIN":
//             endpoint = "/dashboard/admin";
//             break;
//           case "TEACHER":
//             endpoint = "/dashboard/teacher";
//             break;
//           case "STUDENT":
//             endpoint = "/dashboard/student";
//             break;
//           case "PARENT":
//             endpoint = "/dashboard/parent";
//             break;
//           default:
//             throw new Error(`Unsupported role: ${user.role}`);
//         }

//         const response = await apiClient.get(endpoint);

//         // For admin, generate mock chart data if not provided by backend
//         if (role === "ADMIN") {
//           const adminData = response.data as AdminDashboard;
//           if (!adminData.enrollmentTrend || !adminData.attendanceByGrade) {
//             const mockCharts = generateMockChartData(
//               adminData.totalStudents,
//               adminData.totalClasses
//             );
//             adminData.enrollmentTrend = mockCharts.enrollmentTrend;
//             adminData.attendanceByGrade = mockCharts.attendanceByGrade;
//           }
//         }

//         setDashboard({ role, data: response.data });
//         setError(null);
//       } catch (err: any) {
//         console.error("Dashboard fetch error:", err);
//         setError(err.message || "Failed to load dashboard");
//         toast.error("Could not load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
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
//             <StatCard title="Total Students" value={stats.totalStudents} icon={UsersIcon} color="blue" isLoading={loading} />
//             <StatCard title="Total Teachers" value={stats.totalTeachers} icon={AcademicCapIcon} color="green" isLoading={loading} />
//             <StatCard title="Total Parents" value={stats.totalParents} icon={UserGroupIcon} color="purple" isLoading={loading} />
//             <StatCard title="Total Classes" value={stats.totalClasses} icon={BookOpenIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Total Subjects" value={stats.totalSubjects} icon={ClipboardDocumentListIcon} color="indigo" isLoading={loading} />
//             <StatCard title="Recent Enrollments" value={stats.recentEnrollments} icon={CalendarIcon} color="red" isLoading={loading} />
//             <StatCard title="Recent Assignments" value={stats.recentAssignments} icon={ClockIcon} color="orange" isLoading={loading} />
//           </>
//         )}

//         {user.role === "TEACHER" && (
//           <>
//             <StatCard title="Total Classes" value={stats.totalClasses} icon={BookOpenIcon} color="blue" isLoading={loading} />
//             <StatCard title="Total Students" value={stats.totalStudents} icon={UsersIcon} color="green" isLoading={loading} />
//             <StatCard title="Pending Grading" value={stats.pendingGrading} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Upcoming Assignments" value={stats.upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
//           </>
//         )}

//         {user.role === "STUDENT" && (
//           <>
//             <StatCard title="Class" value={stats.className} icon={BookOpenIcon} color="blue" isLoading={loading} />
//             <StatCard
//               title="Attendance"
//               value={stats.attendancePercentage !== undefined ? `${stats.attendancePercentage}%` : undefined}
//               icon={ChartBarIcon}
//               color="green"
//               isLoading={loading}
//             />
//             <StatCard
//               title="Average Grade"
//               value={stats.averageGrade !== undefined ? `${stats.averageGrade}%` : undefined}
//               icon={AcademicCapIcon}
//               color="purple"
//               isLoading={loading}
//             />
//             <StatCard title="Pending Assignments" value={stats.pendingAssignments} icon={ClipboardDocumentListIcon} color="yellow" isLoading={loading} />
//             <StatCard title="Upcoming Assignments" value={stats.upcomingAssignments} icon={CalendarIcon} color="red" isLoading={loading} />
//           </>
//         )}

//         {user.role === "PARENT" && (
//           <StatCard title="Children" value={stats.children?.length} icon={UserGroupIcon} color="blue" isLoading={loading} />
//         )}
//       </div>

//       {/* Charts (Admin only) */}
//       {!loading && user.role === "ADMIN" && stats && (
//         <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trend</h2>
//             {stats.enrollmentTrend ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={stats.enrollmentTrend}>
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
//                 No chart data available
//               </div>
//             )}
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Grade</h2>
//             {stats.attendanceByGrade ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={stats.attendanceByGrade}>
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
//                 No chart data available
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Role‑specific detailed views */}
//       {!loading && dashboard && (
//         <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
//           {/* Teacher: My Classes */}
//           {user.role === "TEACHER" && stats.classSummaries && stats.classSummaries.length > 0 && (
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
//                 <Link to="/classes" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
//                   View all <ChevronRightIcon className="h-4 w-4 ml-1" />
//                 </Link>
//               </div>
//               <div className="space-y-3">
//                 {stats.classSummaries.map((cls) => (
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
//           {user.role === "PARENT" && stats.children && stats.children.length > 0 && (
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Children Overview</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {stats.children.map((child) => (
//                   <div key={child.studentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                     <p className="font-bold text-gray-900">{child.studentName}</p>
//                     <div className="mt-2 space-y-1 text-sm">
//                       <p>Class: {child.className}</p>
//                       <p>Attendance: <span className="font-medium text-green-600">{child.attendancePercentage}%</span></p>
//                       <p>Average Grade: <span className="font-medium text-indigo-600">{child.averageGrade}%</span></p>
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



