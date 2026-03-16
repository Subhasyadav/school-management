package com.school.schoolmanagementsystem.DTOs.request.assignment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SubmissionRequest {
    @NotNull
    private MultipartFile file;            // submitted file
}
