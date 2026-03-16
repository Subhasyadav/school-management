package com.school.schoolmanagementsystem.DTOs.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalParents;
    private long totalClasses;
    private long totalSubjects;
    private long recentEnrollments;   // last 30 days
    private long recentAssignments;    // last 30 days
}
