package com.school.schoolmanagementsystem.DTOs.request.grades;

import lombok.Data;

@Data
public class GradeFilter {
    private Long classId;
    private Long subjectId;
    private Long studentId;
}
