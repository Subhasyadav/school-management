package com.school.schoolmanagementsystem.DTOs.response.users;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter @Setter
@SuperBuilder
public class TeacherResponse extends UserResponse {
    private String qualification;
    private LocalDate hireDate;
}
