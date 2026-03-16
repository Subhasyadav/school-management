package com.school.schoolmanagementsystem.DTOs.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSummary {
    private Long classId;
    private String className;
    private int studentCount;
    private int pendingSubmissions;   // assignments not yet graded
}
