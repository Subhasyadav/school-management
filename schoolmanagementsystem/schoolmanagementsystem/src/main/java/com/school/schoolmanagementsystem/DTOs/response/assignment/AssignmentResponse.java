package com.school.schoolmanagementsystem.DTOs.response.assignment;

import com.school.schoolmanagementsystem.Enum.AssignmentStatus;
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
public class AssignmentResponse {
    private Long id;
    private String title;
    private String description;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private Long teacherId;
    private String teacherName;
    private LocalDate dueDate;
    private String attachmentUrl;
    private int submissionCount;          // optional
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ... existing fields
    private AssignmentStatus status;
    private LocalDateTime publishDate;
    private boolean allowLateSubmission;
    private double latePenaltyPercent;
    private boolean anonymousGrading;
    private boolean deleted;
}
