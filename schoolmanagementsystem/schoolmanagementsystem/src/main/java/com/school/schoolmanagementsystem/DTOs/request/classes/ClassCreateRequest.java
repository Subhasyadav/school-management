package com.school.schoolmanagementsystem.DTOs.request.classes;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClassCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String academicYear;

    private Long classTeacherId;   // optional
}
