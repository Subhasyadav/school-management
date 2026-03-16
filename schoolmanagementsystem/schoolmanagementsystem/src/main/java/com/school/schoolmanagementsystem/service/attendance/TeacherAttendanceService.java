package com.school.schoolmanagementsystem.service.attendance;

//public class TeacherAttendanceService {
//}

//import com.school.schoolmanagementsystem.DTOs.TeacherAttendanceResponse;
//import com.school.schoolmanagementsystem.DTOs.request.BulkTeacherAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkTeacherAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.response.attendance.TeacherAttendanceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TeacherAttendanceService {
    Page<TeacherAttendanceResponse> getTeacherAttendance(Long teacherId, Pageable pageable);
    Page<TeacherAttendanceResponse> getAllTeacherAttendance(Pageable pageable);
    void markTeacherAttendance(BulkTeacherAttendanceRequest request, Long adminId);
    TeacherAttendanceResponse updateTeacherAttendance(Long id, UpdateAttendanceRequest request, Long adminId);
}
