package com.school.schoolmanagementsystem.DTOs.request.attendace;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BulkAttendanceRequest {
    @NotNull
    private Long classId;

    @NotNull
    private LocalDate date;

    @NotNull
    private List<AttendanceRecordRequest> records;
}
