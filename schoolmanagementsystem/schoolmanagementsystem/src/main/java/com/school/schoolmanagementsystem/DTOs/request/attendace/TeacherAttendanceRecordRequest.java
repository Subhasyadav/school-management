package com.school.schoolmanagementsystem.DTOs.request.attendace;

//public class TeacherAttendaceRecordRequest {
//}

import com.school.schoolmanagementsystem.Enum.LeaveType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeacherAttendanceRecordRequest {
    @NotNull
    private Long teacherId;
    @NotNull
    private LeaveType leaveType; // if null, it means present? Better to require.
    private String remarks;
}