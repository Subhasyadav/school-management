package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.request.classes.AssignTeacherRequest;
import com.school.schoolmanagementsystem.DTOs.request.classes.ClassCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.classes.ClassUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.classes.EnrollStudentRequest;
import com.school.schoolmanagementsystem.DTOs.response.classes.ClassRoomResponse;
import com.school.schoolmanagementsystem.DTOs.response.subject.ClassSubjectResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.StudentResponse;
import com.school.schoolmanagementsystem.DTOs.request.*;
import com.school.schoolmanagementsystem.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    // 5.3.1 GET /classes
    @GetMapping
    public ResponseEntity<PageResponse<ClassRoomResponse>> getAllClasses(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(classService.getAllClasses(pageable)));
    }

    // 5.3.2 GET /classes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ClassRoomResponse> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    // 5.3.3 POST /classes (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassRoomResponse> createClass(@Valid @RequestBody ClassCreateRequest request) {
        ClassRoomResponse created = classService.createClass(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5.3.4 PUT /classes/{id} (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassRoomResponse> updateClass(@PathVariable Long id,
                                                         @Valid @RequestBody ClassUpdateRequest request) {
        return ResponseEntity.ok(classService.updateClass(id, request));
    }

    // 5.3.5 DELETE /classes/{id} (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // 5.3.6 GET /classes/{id}/students
    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<PageResponse<StudentResponse>> getStudentsInClass(
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(classService.getStudentsInClass(id, pageable)));
    }

    // 5.3.7 POST /classes/{id}/enroll (admin only)
    @PostMapping("/{id}/enroll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enrollStudent(@PathVariable Long id,
                                              @Valid @RequestBody EnrollStudentRequest request) {
        classService.enrollStudent(id, request.getStudentId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 5.3.8 DELETE /classes/{id}/enroll/{studentId} (admin only)
    @DeleteMapping("/{id}/enroll/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeStudent(@PathVariable Long id, @PathVariable Long studentId) {
        classService.removeStudentFromClass(id, studentId);
        return ResponseEntity.noContent().build();
    }

    // 5.3.9 GET /classes/{id}/subjects
    @GetMapping("/{id}/subjects")
    public ResponseEntity<PageResponse<ClassSubjectResponse>> getSubjectsInClass(
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(classService.getSubjectsInClass(id, pageable)));
    }

    // Additional endpoint: assign teacher to subject (admin only)
    @PostMapping("/{classId}/subjects/{subjectId}/assign-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignTeacherToSubject(
            @PathVariable Long classId,
            @PathVariable Long subjectId,
            @Valid @RequestBody AssignTeacherRequest request) {
        classService.assignTeacherToSubject(classId, subjectId, request.getTeacherId());
        return ResponseEntity.ok().build();
    }
}
