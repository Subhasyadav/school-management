package com.school.schoolmanagementsystem.DTOs.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildSummary {
    private Long studentId;
    private String studentName;
    private String className;
    private double attendancePercentage;
    private double averageGrade;
    private int pendingAssignments;
}
