package com.school.schoolmanagementsystem.DTOs.response.attendance;

import com.school.schoolmanagementsystem.Enum.AttendanceStatus;
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
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;      // first + last name
    private Long classId;
    private String className;
    private LocalDate date;
    private AttendanceStatus status;
    private Long subjectId;          // new field
    private String subjectName;       // new field
    private String remarks;
    private String markedBy;         // teacher's name
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}