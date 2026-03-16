package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.DTOs.dashboard.AdminDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.ParentDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.StudentDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.TeacherDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    TeacherDashboardResponse getTeacherDashboard(Long teacherId);

    StudentDashboardResponse getStudentDashboard(Long studentId);

    ParentDashboardResponse getParentDashboard(Long parentId);
}
