package com.school.schoolmanagementsystem.controller.attendance;

//public class TeacherAttendanceController {
//}
import com.school.schoolmanagementsystem.DTOs.request.PageResponse;
import com.school.schoolmanagementsystem.DTOs.request.attendace.UpdateAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.request.attendace.BulkTeacherAttendanceRequest;
import com.school.schoolmanagementsystem.DTOs.response.attendance.TeacherAttendanceResponse;
import com.school.schoolmanagementsystem.Entity.users.User;
//import com.school.schoolmanagementsystem.service.TeacherAttendanceService;
import com.school.schoolmanagementsystem.service.attendance.TeacherAttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teacher-attendance")
@RequiredArgsConstructor
public class TeacherAttendanceController {

    private final TeacherAttendanceService teacherAttendanceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<TeacherAttendanceResponse>> getAllTeacherAttendance(
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(teacherAttendanceService.getAllTeacherAttendance(pageable)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<PageResponse<TeacherAttendanceResponse>> getMyAttendance(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        Long teacherId = currentUser.getId(); // assuming Teacher extends User
        return ResponseEntity.ok(PageResponse.from(teacherAttendanceService.getTeacherAttendance(teacherId, pageable)));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> markTeacherAttendance(
            @Valid @RequestBody BulkTeacherAttendanceRequest request,
            @AuthenticationPrincipal User currentUser) {
        teacherAttendanceService.markTeacherAttendance(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherAttendanceResponse> updateTeacherAttendance(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAttendanceRequest request,
            @AuthenticationPrincipal User currentUser) {
        TeacherAttendanceResponse updated = teacherAttendanceService.updateTeacherAttendance(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }
}
