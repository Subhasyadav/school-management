package com.school.schoolmanagementsystem.controller.attendance;

import com.school.schoolmanagementsystem.DTOs.request.attendace.AttendanceFilter;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.response.attendance.AttendanceResponse;
import com.school.schoolmanagementsystem.DTOs.request.*;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.attendance.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 5.4.1 GET /attendance (filter by classId and date) – accessible to Teacher and Admin
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PageResponse<AttendanceResponse>> getAttendance(
            @Valid AttendanceFilter filter,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(attendanceService.getAttendance(filter, pageable)));
    }

    // 5.4.2 GET /attendance/student/{studentId} – accessible to Student, Parent, Teacher, Admin
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or " +
            "(hasRole('STUDENT') and #studentId == principal.id) or " +
            "(hasRole('PARENT') and @parentService.isParentOf(#studentId, principal.id))")
    public ResponseEntity<PageResponse<AttendanceResponse>> getAttendanceByStudent(
            @PathVariable Long studentId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(attendanceService.getAttendanceByStudent(studentId, pageable)));
    }

    // 5.4.3 POST /attendance/bulk – Teacher only
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> markAttendance(@Valid @RequestBody BulkAttendanceRequest request,
                                               @AuthenticationPrincipal User currentUser) {
        // currentUser is the authenticated teacher (must be cast to Teacher or use ID)
        attendanceService.markAttendance(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 5.4.4 PUT /attendance/{id} – Teacher only (or admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAttendanceRequest request,
            @AuthenticationPrincipal User currentUser) {
        AttendanceResponse updated = attendanceService.updateAttendance(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/range")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceRange(
            @RequestParam Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceRange(classId, startDate, endDate));
    }
}
