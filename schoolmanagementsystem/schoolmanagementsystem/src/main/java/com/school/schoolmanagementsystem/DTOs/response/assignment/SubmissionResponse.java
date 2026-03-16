package com.school.schoolmanagementsystem.DTOs.response.assignment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private LocalDateTime submissionDate;
    private String fileUrl;
    private Double grade;
    private String feedback;
    private String gradedBy;               // teacher name
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean late;
    private int version;
    private String letterGrade;
    private String gradeType;
}