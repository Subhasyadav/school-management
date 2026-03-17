package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.SubmissionRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeSubmissionRequest;
import com.school.schoolmanagementsystem.DTOs.response.assignment.AssignmentResponse;
import com.school.schoolmanagementsystem.DTOs.response.assignment.SubmissionResponse;
import com.school.schoolmanagementsystem.DTOs.response.classes.TeacherWorkloadResponse;
import com.school.schoolmanagementsystem.DTOs.request.*;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.AssignmentService;
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

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    // ---------- Assignments ----------
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponse<AssignmentResponse>> getAssignments(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long studentId,
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 10, sort = "dueDate", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(
                assignmentService.getAssignments(currentUser, classId, studentId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long id,
                                                                @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id, currentUser));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AssignmentResponse> createAssignment(@ModelAttribute @Valid AssignmentCreateRequest request,
                                                               @AuthenticationPrincipal User currentUser) throws IOException {
        AssignmentResponse created = assignmentService.createAssignment(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AssignmentResponse> updateAssignment(@PathVariable Long id,
                                                               @ModelAttribute @Valid AssignmentUpdateRequest request,
                                                               @AuthenticationPrincipal User currentUser) throws IOException {
        AssignmentResponse updated = assignmentService.updateAssignment(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id,
                                                 @AuthenticationPrincipal User currentUser) {
        assignmentService.deleteAssignment(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AssignmentResponse> publishAssignment(@PathVariable Long id,
                                                                @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(assignmentService.publishAssignment(id, currentUser.getId()));
    }

    // ---------- Submissions ----------
    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionResponse> submitAssignment(@PathVariable Long id,
                                                               @ModelAttribute @Valid SubmissionRequest request,
                                                               @AuthenticationPrincipal User currentUser) throws IOException {
        SubmissionResponse submission = assignmentService.submitAssignment(id, currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PageResponse<SubmissionResponse>> getSubmissionsForAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(
                assignmentService.getSubmissionsForAssignment(id, currentUser, pageable)));
    }

    @PutMapping("/submissions/{id}/grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<SubmissionResponse> gradeSubmission(@PathVariable Long id,
                                                              @Valid @RequestBody GradeSubmissionRequest request,
                                                              @AuthenticationPrincipal User currentUser) {
        SubmissionResponse graded = assignmentService.gradeSubmission(id, request, currentUser.getId());
        return ResponseEntity.ok(graded);
    }

    @GetMapping("/submissions/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or " +
            "(hasRole('STUDENT') and #studentId == principal.id) or " +
            "(hasRole('PARENT') and @parentService.isParentOf(#studentId, principal.id))")
    public ResponseEntity<PageResponse<SubmissionResponse>> getSubmissionsByStudent(
            @PathVariable Long studentId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(assignmentService.getSubmissionsByStudent(studentId, pageable)));
    }

    // Parent endpoint for children's assignments
    @GetMapping("/parents/{parentId}/children")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARENT') and #parentId == principal.id)")
    public ResponseEntity<PageResponse<AssignmentResponse>> getChildrenAssignments(
            @PathVariable Long parentId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(assignmentService.getAssignmentsForParentChildren(parentId, pageable)));
    }

    // Analytics endpoints
    @GetMapping("/analytics/class/{classId}/average-grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Double> getAverageGradeForClass(@PathVariable Long classId) {
        return ResponseEntity.ok(assignmentService.getAverageGradeForClass(classId));
    }

    @GetMapping("/analytics/assignment/{id}/submission-rate")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Double> getSubmissionRate(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getSubmissionRate(id));
    }

    @GetMapping("/analytics/teacher/{teacherId}/workload")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<TeacherWorkloadResponse> getTeacherWorkload(@PathVariable Long teacherId) {
        return ResponseEntity.ok(assignmentService.getTeacherWorkload(teacherId));
    }
}
