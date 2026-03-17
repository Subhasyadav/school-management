package com.school.schoolmanagementsystem.controller;

import com.school.schoolmanagementsystem.DTOs.response.profiles.ChangePasswordRequest;
import com.school.schoolmanagementsystem.DTOs.response.auths.LoginRequest;
import com.school.schoolmanagementsystem.DTOs.response.MessageResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.UserInfoResponse;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.exception.TokenRefreshException;
import com.school.schoolmanagementsystem.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest,
                                   HttpServletResponse response) {
        User user = authService.authenticate(loginRequest);

        // Generate tokens
        String accessToken = authService.generateAccessToken(user);
        String refreshToken = authService.generateRefreshToken(user);

        // Set cookies
        setTokenCookies(response, accessToken, refreshToken);

        // Return user info (no tokens in body)
        UserInfoResponse userInfo = new UserInfoResponse(
                user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name()
        );
        return ResponseEntity.ok(userInfo);
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<?> refreshToken(HttpServletRequest request,
//                                          HttpServletResponse response) {
//        String refreshToken = extractTokenFromCookies(request, "refresh_token");
//        if (refreshToken == null) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Refresh token missing"));
//        }
//
//        String newAccessToken = authService.refreshAccessToken(refreshToken);
//        String newRefreshToken = authService.rotateRefreshToken(refreshToken); // optional rotation
//
//        setTokenCookies(response, newAccessToken, newRefreshToken);
//        return ResponseEntity.ok(new MessageResponse("Token refreshed"));
//    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear cookies
        deleteTokenCookies(response);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            @AuthenticationPrincipal User currentUser) {
        authService.changePassword(currentUser, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    // Helper methods
    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)               // send only over HTTPS (set false for dev)
                .path("/")
                .maxAge(15 * 60)             // 15 minutes
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)    // 7 days
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private void deleteTokenCookies(HttpServletResponse response) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private String extractTokenFromCookies(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        return java.util.Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookies(request, "refresh_token");
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Refresh token missing"));
        }
        try {
            String newAccessToken = authService.refreshAccessToken(refreshToken);
            String newRefreshToken = authService.rotateRefreshToken(refreshToken);
            setTokenCookies(response, newAccessToken, newRefreshToken);
            return ResponseEntity.ok(new MessageResponse("Token refreshed"));
        } catch (TokenRefreshException e) {
            return ResponseEntity.status(401).body(new MessageResponse(e.getMessage()));
        }
    }

}
