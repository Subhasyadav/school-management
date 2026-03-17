package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.response.users.UserResponse;
import com.school.schoolmanagementsystem.DTOs.request.ProfileUpdateRequest;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        // currentUser is already loaded from security context
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request,
                                                      @AuthenticationPrincipal User currentUser) {
        // Use the existing updateUser method but restrict to allowed fields
        // We'll create a helper in service that only updates firstName, lastName, phone
        UserResponse updated = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(updated);
    }
}
