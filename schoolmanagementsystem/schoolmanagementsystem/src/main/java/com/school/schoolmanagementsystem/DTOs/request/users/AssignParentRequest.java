package com.school.schoolmanagementsystem.DTOs.request.users;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignParentRequest {
    @NotNull
    private Long parentId;
}
