package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.response.users.UserResponse;
import com.school.schoolmanagementsystem.DTOs.request.users.AssignParentRequest;
import com.school.schoolmanagementsystem.DTOs.request.PageResponse;
import com.school.schoolmanagementsystem.DTOs.request.users.UserCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.users.UserUpdateRequest;
import com.school.schoolmanagementsystem.Enum.Role;
import com.school.schoolmanagementsystem.service.UserService;
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
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // All methods require ADMIN role
public class UserController {

    private final UserService userService;

    // 5.2.1 GET /api/v1/users (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(userService.getAllUsers(pageable)));
    }

    // 5.2.2 GET /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 5.2.3 POST /api/v1/users
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5.2.4 PUT /api/v1/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // 5.2.5 DELETE /api/v1/users/{id} (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 5.2.6 GET /api/v1/users/teachers
    @GetMapping("/teachers")
    public ResponseEntity<PageResponse<UserResponse>> getAllTeachers(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(userService.getUsersByRole(Role.TEACHER, pageable)));
    }

    // 5.2.7 GET /api/v1/users/students
    @GetMapping("/students")
    public ResponseEntity<PageResponse<UserResponse>> getAllStudents(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(userService.getUsersByRole(Role.STUDENT, pageable)));
    }

    // 5.2.8 GET /api/v1/users/parents
    @GetMapping("/parents")
    public ResponseEntity<PageResponse<UserResponse>> getAllParents(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(userService.getUsersByRole(Role.PARENT, pageable)));
    }
    @GetMapping("/admins")
    public ResponseEntity<PageResponse<UserResponse>> getAllAdmins(
            @PageableDefault(size = 10) Pageable pageable
    ){
        return ResponseEntity.ok(PageResponse.from(userService.getUsersByRole(Role.ADMIN, pageable)));
    }

    // 5.2.9 POST /api/v1/users/{studentId}/parents
    @PostMapping("/{studentId}/parents")
    public ResponseEntity<Void> assignParentToStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody AssignParentRequest request) {
        userService.assignParentToStudent(studentId, request.getParentId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{parentId}/children")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PARENT') and #parentId == principal.id)")
    public ResponseEntity<PageResponse<UserResponse>> getChildrenOfParent(
            @PathVariable Long parentId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(userService.getChildrenOfParent(parentId, pageable)));
    }
}
