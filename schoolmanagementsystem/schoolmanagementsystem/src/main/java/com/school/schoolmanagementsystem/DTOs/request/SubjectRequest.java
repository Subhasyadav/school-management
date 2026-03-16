package com.school.schoolmanagementsystem.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubjectRequest {
    @NotBlank
    private String name;
    private String code;
}