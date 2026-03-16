package com.school.schoolmanagementsystem.DTOs.response.auths;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String accessToken;       // optional, we might return user info only
    private String refreshToken;
    private Long id;
    private String email;
    private String role;
}
