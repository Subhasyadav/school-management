package com.school.schoolmanagementsystem.DTOs.request.attendace;

import com.school.schoolmanagementsystem.Enum.AttendanceStatus;
import com.school.schoolmanagementsystem.Enum.LeaveType;
import lombok.Data;

@Data
public class UpdateAttendanceRequest {
    private AttendanceStatus status;
    private String remarks;
    private LeaveType leaveType;
}
