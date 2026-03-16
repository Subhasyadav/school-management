package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.response.GradeResponse;
import com.school.schoolmanagementsystem.DTOs.request.*;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeFilter;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeUpdateRequest;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.GradeService;
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
@RequestMapping("/api/v1/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    // 5.5.1 GET /grades (filter by class/subject/student) – accessible to Teacher and Admin
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PageResponse<GradeResponse>> getGrades(
            @Valid GradeFilter filter,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(gradeService.getGrades(filter, pageable)));
    }

    // 5.5.2 GET /grades/student/{studentId} – accessible to Student, Parent, Teacher, Admin
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or " +
            "(hasRole('STUDENT') and #studentId == principal.id) or " +
            "(hasRole('PARENT') and @parentService.isParentOf(#studentId, principal.id))")
    public ResponseEntity<PageResponse<GradeResponse>> getGradesByStudent(
            @PathVariable Long studentId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(gradeService.getGradesByStudent(studentId, pageable)));
    }

    // 5.5.3 POST /grades – Teacher only
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<GradeResponse> createGrade(@Valid @RequestBody GradeCreateRequest request,
                                                     @AuthenticationPrincipal User currentUser) {
        GradeResponse created = gradeService.createGrade(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5.5.4 PUT /grades/{id} – Teacher only (or admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeResponse> updateGrade(@PathVariable Long id,
                                                     @Valid @RequestBody GradeUpdateRequest request,
                                                     @AuthenticationPrincipal User currentUser) {
        GradeResponse updated = gradeService.updateGrade(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    // 5.5.5 DELETE /grades/{id} – Teacher or Admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id,
                                            @AuthenticationPrincipal User currentUser) {
        gradeService.deleteGrade(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}