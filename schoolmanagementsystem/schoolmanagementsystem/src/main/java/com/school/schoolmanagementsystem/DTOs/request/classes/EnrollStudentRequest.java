package com.school.schoolmanagementsystem.DTOs.request.classes;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnrollStudentRequest {
    @NotNull
    private Long studentId;
}
