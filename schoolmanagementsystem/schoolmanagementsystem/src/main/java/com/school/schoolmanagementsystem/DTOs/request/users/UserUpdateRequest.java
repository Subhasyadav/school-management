package com.school.schoolmanagementsystem.DTOs.request.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateRequest {

    @Email
    private String email;

    @Size(min = 6)
    private String password;

    private String firstName;
    private String lastName;
    private String phone;

    // Teacher fields
    private String qualification;
    private LocalDate hireDate;

    // Student fields
    private LocalDate enrollmentDate;
    private LocalDate dateOfBirth;
    private String address;

    // Parent fields
    private String occupation;
}