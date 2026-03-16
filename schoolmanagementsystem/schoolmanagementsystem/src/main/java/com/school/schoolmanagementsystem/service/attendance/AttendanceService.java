package com.school.schoolmanagementsystem.service.attendance;

import com.school.schoolmanagementsystem.DTOs.response.attendance.AttendanceResponse;
import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceFilter;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    Page<AttendanceResponse> getAttendance(AttendanceFilter filter, Pageable pageable);

    Page<AttendanceResponse> getAttendanceByStudent(Long studentId, Pageable pageable);

    void markAttendance(BulkAttendanceRequest request, Long teacherId);

    AttendanceResponse updateAttendance(Long attendanceId, UpdateAttendanceRequest request, Long teacherId);
    // AttendanceService.java
    List<AttendanceResponse> getAttendanceRange(Long classId, LocalDate startDate, LocalDate endDate);
}
