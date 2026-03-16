package com.school.schoolmanagementsystem.DTOs.request.users;

//import com.school.entity.Role;
import com.school.schoolmanagementsystem.Enum.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserCreateRequest {

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phone;

    @NotNull
    private Role role;

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
