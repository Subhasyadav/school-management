package com.school.schoolmanagementsystem.DTOs.request.grades;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GradeCreateRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long subjectId;

    @NotNull
    private Long classId;

    @NotBlank
    private String examName;

    private LocalDate examDate;

    @NotNull @Positive
    private Double marksObtained;

    @NotNull @Positive
    private Double maxMarks;

    private String gradeLetter;

    private String remarks;
}
