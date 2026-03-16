package com.school.schoolmanagementsystem.DTOs.response.attendance;

//public class TeacherAttendanceResponse {
//}

import com.school.schoolmanagementsystem.Enum.LeaveType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TeacherAttendanceResponse {
    private Long id;
    private Long teacherId;
    private String teacherName;
    private String department; // optional, from Teacher entity
    private LocalDate date;
    private LeaveType leaveType;
    private String remarks;
    private String markedBy; // admin name
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
