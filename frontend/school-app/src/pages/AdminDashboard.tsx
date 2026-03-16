"use client";

import React, { useState, useEffect } from "react";
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
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Layout from "../component/layout";
// import Layout from "../../components/Layout"; // adjust path to your Layout

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalParents: number;
  pendingApplications: number;
  upcomingEvents: number;
  totalClasses: number;
  revenueCollected: string;
}

interface EnrollmentData {
  month: string;
  students: number;
}

interface AttendanceData {
  grade: string;
  averageAttendance: number;
}

interface PendingApplication {
  id: string;
  studentName: string;
  grade: string;
  submittedDate: string;
  status: "pending" | "reviewing";
}

// ----------------------------------------------------------------------
// Mock Data Functions
// ----------------------------------------------------------------------

const fetchDashboardStats = (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStudents: 1250,
        totalTeachers: 85,
        totalStaff: 42,
        totalParents: 980,
        pendingApplications: 14,
        upcomingEvents: 3,
        totalClasses: 48,
        revenueCollected: "$2.4M",
      });
    }, 800);
  });
};

const fetchEnrollmentData = (): Promise<EnrollmentData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { month: "Jan", students: 1100 },
        { month: "Feb", students: 1150 },
        { month: "Mar", students: 1200 },
        { month: "Apr", students: 1220 },
        { month: "May", students: 1240 },
        { month: "Jun", students: 1250 },
      ]);
    }, 1000);
  });
};

const fetchAttendanceData = (): Promise<AttendanceData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { grade: "Grade 9", averageAttendance: 94 },
        { grade: "Grade 10", averageAttendance: 91 },
        { grade: "Grade 11", averageAttendance: 89 },
        { grade: "Grade 12", averageAttendance: 93 },
      ]);
    }, 900);
  });
};

const fetchPendingApplications = (): Promise<PendingApplication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          studentName: "Emma Watson",
          grade: "Grade 10",
          submittedDate: "2025-05-10",
          status: "pending",
        },
        {
          id: "2",
          studentName: "James Brown",
          grade: "Grade 9",
          submittedDate: "2025-05-09",
          status: "reviewing",
        },
        {
          id: "3",
          studentName: "Sophia Lee",
          grade: "Grade 11",
          submittedDate: "2025-05-08",
          status: "pending",
        },
      ]);
    }, 700);
  });
};

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}> = ({ title, value, icon, color, isLoading }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex items-center justify-between border border-gray-100 group min-w-[200px] flex-1">
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </p>
      {isLoading ? (
        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse mt-2"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      )}
    </div>
    <div
      className={`p-4 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}
    >
      <div className={`w-6 h-6 ${color.replace("bg-", "text-")}`}>{icon}</div>
    </div>
  </div>
);

const SkeletonRow: React.FC = () => (
  <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
);

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [applications, setApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    enrollment: true,
    attendance: true,
    applications: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, enrollmentRes, attendanceRes, appsRes] =
          await Promise.all([
            fetchDashboardStats(),
            fetchEnrollmentData(),
            fetchAttendanceData(),
            fetchPendingApplications(),
          ]);
        setStats(statsRes);
        setEnrollmentData(enrollmentRes);
        setAttendanceData(attendanceRes);
        setApplications(appsRes);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading({
          stats: false,
          enrollment: false,
          attendance: false,
          applications: false,
        });
      }
    };
    loadData();
  }, []);

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

  return (
    <Layout>
      {/* Header */}
      <div className="p-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
          </span>
        </div>
      </div>

      {/* ========== ALL STAT CARDS IN ONE SINGLE LINE (FLEX WRAP) ========== */}
      <div className="flex flex-wrap gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? "-"}
          icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
          color="bg-blue-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers ?? "-"}
          icon={<AcademicCapIcon className="h-6 w-6 text-green-600" />}
          color="bg-green-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Total Staff"
          value={stats?.totalStaff ?? "-"}
          icon={<UserGroupIcon className="h-6 w-6 text-purple-600" />}
          color="bg-purple-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Total Parents"
          value={stats?.totalParents ?? "-"}
          icon={<UsersIcon className="h-6 w-6 text-orange-600" />}
          color="bg-orange-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Pending Applications"
          value={stats?.pendingApplications ?? "-"}
          icon={<ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />}
          color="bg-yellow-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents ?? "-"}
          icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
          color="bg-indigo-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Total Classes"
          value={stats?.totalClasses ?? "-"}
          icon={<ClipboardDocumentListIcon className="h-6 w-6 text-pink-600" />}
          color="bg-pink-500"
          isLoading={loading.stats}
        />
        <StatCard
          title="Revenue"
          value={stats?.revenueCollected ?? "-"}
          icon={<ChartBarIcon className="h-6 w-6 text-teal-600" />}
          color="bg-teal-500"
          isLoading={loading.stats}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollment Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Enrollment Trend
          </h2>
          {loading.enrollment ? (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={enrollmentData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance by Grade
          </h2>
          {loading.attendance ? (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={attendanceData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" tick={{ fill: "#6b7280" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="averageAttendance"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Panels: Pending Applications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Applications
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          {loading.applications ? (
            <div className="space-y-3">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {app.studentName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {app.grade}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {app.submittedDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {app.status === "pending" ? "Pending" : "Reviewing"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-900 font-medium transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
              Add New User
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Create Announcement
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              View All Applications
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Generate Reports
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Upcoming Events
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Science Fair", date: "May 15" },
                { name: "Parent-Teacher Meeting", date: "May 20" },
                { name: "Sports Day", date: "May 25" },
              ].map((event, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-800">{event.name}</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {event.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}