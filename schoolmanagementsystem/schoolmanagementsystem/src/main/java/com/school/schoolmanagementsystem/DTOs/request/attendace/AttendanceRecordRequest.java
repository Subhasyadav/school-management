package com.school.schoolmanagementsystem.DTOs.request.attendace;

import com.school.schoolmanagementsystem.Enum.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRecordRequest {
    @NotNull
    private Long studentId;

    private Long subjectId;

    @NotNull
    private AttendanceStatus status;

    private String remarks;
}
