// import "./App.css";
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from "./components/PrivateRoute";
// import Login from "./pages/Login";
// import ChangePassword from "./pages/ChangePassword";
// import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/Dashboards";
// import AdminDashboard from "./pages/AdminDashboard";
// import UsersList from "./pages/admin/UsersList";
// import UserEdit from "./pages/admin/UserEdit";
// import AssignParent from "./pages/admin/AssignParent";
// import ClassDetail from "./pages/classes/ClassDetail";
// import EnrollStudent from "./pages/classes/EnrollStudent";
// import ClassList from "./pages/classes/ClassList";
// import ClassForms from "./pages/classes/ClassForm";
// import SubjectList from "./pages/subject/SubjectList";
// import Profile from "./pages/profile/profile";
// import GradeManagement from "./pages/grade/GradeManagement";
// import AttendanceManagement from "./pages/attendaces/AttendanceModel";
// import AssignmentDetailModal from "./pages/assignments/AssignmentDetailsModel";
// // import AssignmentDetailModal from "./pages/assignments/AssignmentDetailsModel";
// // import SubjectsInClass from './pages/classes/SubjextsInClass';
// // import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route element={<PrivateRoute />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/change-password" element={<ChangePassword />} />
//             <Route path="admin-dashboard" element={<AdminDashboard />} />
//             // In your router (e.g., App.tsx)
//             <Route path="/admin/users" element={<UsersList />} />
//             <Route path="/admin/users/new" element={<UserEdit />} />
//             <Route path="/admin/users/:id/edit" element={<UserEdit />} />
//             <Route
//               path="/admin/users/assign-parent"
//               element={<AssignParent />}
//             />
//             <Route path="classes" element={<ClassList />} />
//             <Route path="classes/new" element={<ClassForms />} />
//             <Route path="classes/:id" element={<ClassDetail />} />
//             <Route path="classes/:id/edit" element={<ClassForms />} />
//             <Route path="subjects" element={<SubjectList />} />
//             <Route path="classes/:id/enroll" element={<EnrollStudent />} />
//             <Route path="profile" element={<Profile/>}/>
//             <Route path="grade" element={<GradeManagement/>}/>
//             <Route path="attendance" element={<AttendanceManagement/>}/>
//             <Route path="assignment" element={<AssignmentDetailModal/>}/>
//           </Route>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;



import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboards";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import UserEdit from "./pages/admin/UserEdit";
import AssignParent from "./pages/admin/AssignParent";
import ClassDetail from "./pages/classes/ClassDetail";
import EnrollStudent from "./pages/classes/EnrollStudent";
import ClassList from "./pages/classes/ClassList";
import ClassForms from "./pages/classes/ClassForm";
import SubjectList from "./pages/subject/SubjectList";
import Profile from "./pages/profile/profile";
import GradeManagement from "./pages/grade/GradeManagement";
import AttendanceManagement from "./pages/attendaces/AttendanceModel";
import AssignmentManagement from "./pages/assignments/AssignmentModel";
import AdminTeacherLeavePage from "./pages/attendaces/AdminTeacherLeave";
import TeacherMyAttendancePage from "./pages/attendaces/TeacherMyAttendancePage";
// import AssignSubjectModal from "./pages/classes/AssignSubjectModel";
// import AssignTeacherModal from "./pages/classes/AssignTeacherModal";
// Corrected: import the list page, not the modal
// import AssignmentManagement from "./pages/assignments/AssignmentManagement";

// Optional: lazy load for better performance
// const GradeManagement = lazy(() => import("./pages/grade/GradeManagement"));
// const AttendanceManagement = lazy(() => import("./pages/attendaces/AttendanceModel"));
// const AssignmentManagement = lazy(() => import("./pages/assignments/AssignmentManagement"));

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersList />} />
                <Route path="/admin/users/new" element={<UserEdit />} />
                <Route path="/admin/users/:id/edit" element={<UserEdit />} />
                <Route path="/admin/users/assign-parent" element={<AssignParent />} />
                <Route path="/classes" element={<ClassList />} />
                <Route path="/classes/new" element={<ClassForms />} />
                <Route path="/classes/:id" element={<ClassDetail />} />
                <Route path="/classes/:id/edit" element={<ClassForms />} />
                {/* <Route path="/subject-assign" element={<AssignSubjectModal/>}/> */}
                {/* <Route path="/subject-assign" element={<AssignTeacherModal/>} /> */}
                <Route path="/subjects" element={<SubjectList />} />
                <Route path="/classes/:id/enroll" element={<EnrollStudent />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/grade" element={<GradeManagement />} />
                <Route path="/attendance" element={<AttendanceManagement />} />
                <Route path="/assignments" element={<AssignmentManagement />} />
                <Route path="/admin/teacher-leave" element={<AdminTeacherLeavePage />} />
                <Route path="/teacher/my-attendance" element={<TeacherMyAttendancePage />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
