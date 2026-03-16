//package com.school.schoolmanagementsystem.service.impl;
//
//import com.school.schoolmanagementsystem.DTOs.response.attendance.AttendanceResponse;
//import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceFilter;
//import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceRecordRequest;
//import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkAttendanceRequest;
//import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
//import com.school.schoolmanagementsystem.Entity.*;
//import com.school.schoolmanagementsystem.Enum.AttendanceStatus;
//import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
//import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
//import com.school.schoolmanagementsystem.Repository.*;
//import com.school.schoolmanagementsystem.service.attendance.AttendanceService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class AttendanceServiceImpl implements AttendanceService {
//
//    private final AttendanceRepository attendanceRepository;
//    private final ClassRoomRepository classRoomRepository;
//    private final StudentRepository studentRepository;
//    private final TeacherRepository teacherRepository;
//    private final UserRepository userRepository; // to validate teacher
//
//    @Override
//    public Page<AttendanceResponse> getAttendance(AttendanceFilter filter, Pageable pageable) {
//        if (filter.getClassId() != null && filter.getDate() != null) {
//            return attendanceRepository.findByClassRoomIdAndDate(filter.getClassId(), filter.getDate(), pageable)
//                    .map(this::mapToResponse);
//        } else {
//            // Fallback: return all attendance (should be restricted by role, but we'll assume filter is required)
//            throw new IllegalArgumentException("Both classId and date are required for filtering");
//        }
//    }
//
//    @Override
//    public Page<AttendanceResponse> getAttendanceByStudent(Long studentId, Pageable pageable) {
//        // Verify student exists
//        if (!studentRepository.existsById(studentId)) {
//            throw new ResourceNotFoundException("Student not found with id: " + studentId);
//        }
//        return attendanceRepository.findByStudentId(studentId, pageable)
//                .map(this::mapToResponse);
//    }
//
//    @Override
//    public void markAttendance(BulkAttendanceRequest request, Long teacherId) {
//        // Validate class
//        ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
//                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
//
//        // Validate teacher
//        Teacher teacher = teacherRepository.findActiveById(teacherId)
//                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
//
//        // Ensure teacher is authorized to mark attendance for this class (optional: check if teacher teaches any subject in this class)
//        // For simplicity, we skip that check here.
//
//        LocalDate date = request.getDate();
//
//        // Process each record
//        for (AttendanceRecordRequest record : request.getRecords()) {
//            Student student = studentRepository.findActiveById(record.getStudentId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + record.getStudentId()));
//
//            // Check if already marked for this student on this date
//            if (attendanceRepository.existsByStudentIdAndDate(student.getId(), date)) {
//                throw new DuplicateResourceException("Attendance already marked for student " + student.getId() + " on " + date);
//            }
//
//            Attendance attendance = new Attendance();
//            attendance.setStudent(student);
//            attendance.setClassRoom(classRoom);
//            attendance.setDate(date);
//            attendance.setStatus(record.getStatus());
//            attendance.setRemarks(record.getRemarks());
//            attendance.setMarkedBy(teacher);
//
//            attendanceRepository.save(attendance);
//        }
//    }
//
//    @Override
//    public AttendanceResponse updateAttendance(Long attendanceId, UpdateAttendanceRequest request, Long teacherId) {
//        Attendance attendance = attendanceRepository.findById(attendanceId)
//                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + attendanceId));
//
//        // Only the teacher who marked it (or admin) can update. We'll check role in controller, but also ensure teacher is not updating others' records if needed.
//        // For simplicity, we allow any teacher to update any attendance (could be refined later).
//
//        if (request.getStatus() != null) {
//            attendance.setStatus(request.getStatus());
//        }
//        if (request.getRemarks() != null) {
//            attendance.setRemarks(request.getRemarks());
//        }
//
//        return mapToResponse(attendance);
//    }
//
//    // ---------- Mapping Helpers ----------
//    private AttendanceResponse mapToResponse(Attendance attendance) {
//        return AttendanceResponse.builder()
//                .id(attendance.getId())
//                .studentId(attendance.getStudent().getId())
//                .studentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName())
//                .classId(attendance.getClassRoom().getId())
//                .className(attendance.getClassRoom().getName())
//                .date(attendance.getDate())
//                .status(attendance.getStatus())
//                .remarks(attendance.getRemarks())
//                .markedBy(attendance.getMarkedBy() != null ?
//                        attendance.getMarkedBy().getFirstName() + " " + attendance.getMarkedBy().getLastName() : null)
//                .createdAt(attendance.getCreatedAt())
//                .updatedAt(attendance.getUpdatedAt())
//                .build();
//    }
//}


package com.school.schoolmanagementsystem.service.impl.attendance;

import com.school.schoolmanagementsystem.DTOs.response.attendance.AttendanceResponse;
import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceFilter;
import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceRecordRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import com.school.schoolmanagementsystem.Entity.*;
import com.school.schoolmanagementsystem.Entity.attendance.Attendance;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Repository.attendance.AttendanceRepository;
//import com.school.schoolmanagementsystem.Repository.attendance.TeacherSubjectRepository;
import com.school.schoolmanagementsystem.Repository.classes.ClassRoomRepository;
import com.school.schoolmanagementsystem.Repository.subjects.ClassSubjectRepository;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.Repository.users.StudentRepository;
import com.school.schoolmanagementsystem.Repository.users.TeacherRepository;
import com.school.schoolmanagementsystem.Repository.users.UserRepository;
import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.attendance.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ClassRoomRepository classRoomRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;          // to validate teacher user
//    private final TeacherSubjectRepository teacherSubjectRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSubjectRepository classSubjectRepository;

    @Override
    public Page<AttendanceResponse> getAttendance(AttendanceFilter filter, Pageable pageable) {
        if (filter.getClassId() != null && filter.getDate() != null) {
            return attendanceRepository.findByClassRoomIdAndDate(filter.getClassId(), filter.getDate(), pageable)
                    .map(this::mapToResponse);
        } else {
            throw new IllegalArgumentException("Both classId and date are required for filtering");
        }
    }

    @Override
    public Page<AttendanceResponse> getAttendanceByStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return attendanceRepository.findByStudentId(studentId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public void markAttendance(BulkAttendanceRequest request, Long teacherId) {
        // Validate class
        ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        // Validate teacher
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        // Process each record
        List<Attendance> attendanceList = new ArrayList<>();
        for (AttendanceRecordRequest record : request.getRecords()) {
            // Validate student
            Student student = studentRepository.findActiveById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + record.getStudentId()));

            // Check duplicate
            if (attendanceRepository.existsByStudentIdAndDate(student.getId(), request.getDate())) {
                throw new DuplicateResourceException(
                        "Attendance already marked for student " + student.getId() + " on " + request.getDate());
            }

            // Validate subject
            Subject subject = subjectRepository.findById(record.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + record.getSubjectId()));

            // Verify teacher is authorized to mark attendance for this subject in this class
            boolean authorized = classSubjectRepository.existsByTeacherIdAndClassRoomIdAndSubjectId(
                    teacherId, request.getClassId(), record.getSubjectId());
            if (!authorized) {
                throw new AccessDeniedException(
                        "Teacher is not authorized to mark attendance for subject " + subject.getName() +
                                " in class " + classRoom.getName());
            }

            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setClassRoom(classRoom);
            attendance.setSubject(subject);
            attendance.setDate(request.getDate());
            attendance.setStatus(record.getStatus());
            attendance.setRemarks(record.getRemarks());
            attendance.setMarkedBy(teacher);

            attendanceList.add(attendance);
        }

        // Bulk save
        attendanceRepository.saveAll(attendanceList);
    }

    @Override
    public AttendanceResponse updateAttendance(Long attendanceId, UpdateAttendanceRequest request, Long teacherId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + attendanceId));

        // Optional: verify teacher is the one who marked it or has permission (could be admin too)
        // For now, we allow any teacher to update (can be refined later)

        if (request.getStatus() != null) {
            attendance.setStatus(request.getStatus());
        }
        if (request.getRemarks() != null) {
            attendance.setRemarks(request.getRemarks());
        }

        return mapToResponse(attendance);
    }

    // ---------- Mapping Helper ----------
    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName())
                .classId(attendance.getClassRoom().getId())
                .className(attendance.getClassRoom().getName())
                .subjectId(attendance.getSubject() != null ? attendance.getSubject().getId() : null)
                .subjectName(attendance.getSubject() != null ? attendance.getSubject().getName() : null)
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .markedBy(attendance.getMarkedBy() != null ?
                        attendance.getMarkedBy().getFirstName() + " " + attendance.getMarkedBy().getLastName() : null)
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }

    @Override
    public List<AttendanceResponse> getAttendanceRange(Long classId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByClassRoomIdAndDateBetween(classId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}