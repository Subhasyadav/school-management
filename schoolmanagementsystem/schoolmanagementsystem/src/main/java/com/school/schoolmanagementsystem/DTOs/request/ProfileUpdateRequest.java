package com.school.schoolmanagementsystem.DTOs.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    // Email and password changes are handled separately via change-password and email update (maybe admin only)
}
