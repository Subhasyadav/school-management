package com.school.schoolmanagementsystem.DTOs.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponse {
    private String className;
    private double attendancePercentage;   // last 30 days
    private double averageGrade;            // overall
    private int pendingAssignments;         // assignments not yet submitted
    private int upcomingAssignments;        // due in next 7 days
}
