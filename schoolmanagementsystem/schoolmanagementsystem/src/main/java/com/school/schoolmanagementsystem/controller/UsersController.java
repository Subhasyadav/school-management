package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.response.users.UserInfoResponse;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UsersController {

    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        UserInfoResponse response = new UserInfoResponse(
                currentUser.getId(),
                currentUser.getEmail(),
                currentUser.getFirstName(),
                currentUser.getLastName(),
                currentUser.getRole().name()
        );
        return ResponseEntity.ok(response);
    }

}