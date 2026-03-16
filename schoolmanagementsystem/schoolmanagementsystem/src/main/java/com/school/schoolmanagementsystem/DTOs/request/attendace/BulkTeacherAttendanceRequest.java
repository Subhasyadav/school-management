package com.school.schoolmanagementsystem.DTOs.request.attendace;

//public class BulkTeacherAttendanceRecordRequest {
//}

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BulkTeacherAttendanceRequest {
    @NotNull
    private LocalDate date;
    @NotNull
    private List<TeacherAttendanceRecordRequest> records;
}
