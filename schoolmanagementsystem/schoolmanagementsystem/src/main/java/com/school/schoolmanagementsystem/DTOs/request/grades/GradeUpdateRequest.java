package com.school.schoolmanagementsystem.DTOs.request.grades;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GradeUpdateRequest {
    private String examName;
    private LocalDate examDate;
    private Double marksObtained;
    private Double maxMarks;
    private String gradeLetter;
    private String remarks;
}