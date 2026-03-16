package com.school.schoolmanagementsystem.service.impl.attendance;

//public class TeacherAttendanceServiceImp {
//}

//import com.school.schoolmanagementsystem.DTOs.TeacherAttendanceResponse;
//import com.school.schoolmanagementsystem.DTOs.request.BulkTeacherAttendanceRequest;
//import com.school.schoolmanagementsystem.DTOs.request.TeacherAttendanceRecordRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkTeacherAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.TeacherAttendanceRecordRequest;
import com.school.schoolmanagementsystem.DTOs.response.attendance.TeacherAttendanceResponse;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
//import com.school.schoolmanagementsystem.Entity.TeacherAttendance;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.Entity.attendance.TeacherAttendance;
import com.school.schoolmanagementsystem.Repository.attendance.TeacherAttendanceRepository;
import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
//import com.school.schoolmanagementsystem.Repository.TeacherAttendanceRepository;
import com.school.schoolmanagementsystem.Repository.users.TeacherRepository;
import com.school.schoolmanagementsystem.Repository.users.UserRepository;
//import com.school.schoolmanagementsystem.service.TeacherAttendanceService;
import com.school.schoolmanagementsystem.service.attendance.TeacherAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherAttendanceServiceImpl implements TeacherAttendanceService {

    private final TeacherAttendanceRepository teacherAttendanceRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Override
    public Page<TeacherAttendanceResponse> getTeacherAttendance(Long teacherId, Pageable pageable) {
        if (!teacherRepository.existsById(teacherId)) {
            throw new ResourceNotFoundException("Teacher not found with id: " + teacherId);
        }
        return teacherAttendanceRepository.findByTeacherId(teacherId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<TeacherAttendanceResponse> getAllTeacherAttendance(Pageable pageable) {
        return teacherAttendanceRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public void markTeacherAttendance(BulkTeacherAttendanceRequest request, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        for (TeacherAttendanceRecordRequest record : request.getRecords()) {
            Teacher teacher = teacherRepository.findById(record.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + record.getTeacherId()));

            if (teacherAttendanceRepository.existsByTeacherIdAndDate(teacher.getId(), request.getDate())) {
                throw new DuplicateResourceException("Attendance already marked for teacher " + teacher.getId() + " on " + request.getDate());
            }

            TeacherAttendance attendance = new TeacherAttendance();
            attendance.setTeacher(teacher);
            attendance.setDate(request.getDate());
            attendance.setLeaveType(record.getLeaveType());
            attendance.setRemarks(record.getRemarks());
            attendance.setMarkedBy(admin);

            teacherAttendanceRepository.save(attendance);
        }
    }

    @Override
    public TeacherAttendanceResponse updateTeacherAttendance(Long id, UpdateAttendanceRequest request, Long adminId) {
        TeacherAttendance attendance = teacherAttendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher attendance not found with id: " + id));

        if (request.getLeaveType() != null) {
            attendance.setLeaveType(request.getLeaveType());
        }
        if (request.getRemarks() != null) {
            attendance.setRemarks(request.getRemarks());
        }

        return mapToResponse(attendance);
    }

    private TeacherAttendanceResponse mapToResponse(TeacherAttendance attendance) {
        return TeacherAttendanceResponse.builder()
                .id(attendance.getId())
                .teacherId(attendance.getTeacher().getId())
                .teacherName(attendance.getTeacher().getFirstName() + " " + attendance.getTeacher().getLastName())
                .department(attendance.getTeacher().getDepartment()) // assuming Teacher has department field
                .date(attendance.getDate())
                .leaveType(attendance.getLeaveType())
                .remarks(attendance.getRemarks())
                .markedBy(attendance.getMarkedBy() != null ?
                        attendance.getMarkedBy().getFirstName() + " " + attendance.getMarkedBy().getLastName() : null)
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
