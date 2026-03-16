package com.school.schoolmanagementsystem.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long id;
    private Long studentId;
    private String studentName;       // first + last name
    private Long subjectId;
    private String subjectName;
    private Long classId;
    private String className;
    private String examName;
    private LocalDate examDate;
    private Double marksObtained;
    private Double maxMarks;
    private String gradeLetter;
    private String remarks;
    private String enteredBy;          // teacher's name
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}