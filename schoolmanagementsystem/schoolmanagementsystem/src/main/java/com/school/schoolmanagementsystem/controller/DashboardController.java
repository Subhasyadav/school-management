package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.dashboard.AdminDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.ParentDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.StudentDashboardResponse;
import com.school.schoolmanagementsystem.DTOs.dashboard.TeacherDashboardResponse;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<TeacherDashboardResponse> getTeacherDashboard(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(dashboardService.getTeacherDashboard(currentUser.getId()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(currentUser.getId()));
    }

    @GetMapping("/parent")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<ParentDashboardResponse> getParentDashboard(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(dashboardService.getParentDashboard(currentUser.getId()));
    }
}