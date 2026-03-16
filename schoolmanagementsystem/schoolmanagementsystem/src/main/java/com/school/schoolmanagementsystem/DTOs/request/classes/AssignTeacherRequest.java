package com.school.schoolmanagementsystem.DTOs.request.classes;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTeacherRequest {
    @NotNull
    private Long teacherId;
}
