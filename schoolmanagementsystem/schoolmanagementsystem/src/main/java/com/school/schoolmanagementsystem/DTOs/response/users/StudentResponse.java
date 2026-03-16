package com.school.schoolmanagementsystem.DTOs.response.users;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter @Setter
@SuperBuilder
public class StudentResponse extends UserResponse {
    private LocalDate enrollmentDate;
    private LocalDate dateOfBirth;
    private String address;
}
