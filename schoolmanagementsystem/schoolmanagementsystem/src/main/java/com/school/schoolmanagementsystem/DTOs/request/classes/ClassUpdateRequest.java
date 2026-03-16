package com.school.schoolmanagementsystem.DTOs.request.classes;

import lombok.Data;

@Data
public class ClassUpdateRequest {
    private String name;
    private String academicYear;
    private Long classTeacherId;
}
