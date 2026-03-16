package com.school.schoolmanagementsystem.DTOs.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDashboardResponse {
    private long totalClasses;                // classes taught by this teacher
    private long totalStudents;                // across all classes
    private long pendingGrading;               // assignments waiting for grading
    private long upcomingAssignments;           // assignments due soon
    private List<ClassSummary> classSummaries;  // per-class stats
}