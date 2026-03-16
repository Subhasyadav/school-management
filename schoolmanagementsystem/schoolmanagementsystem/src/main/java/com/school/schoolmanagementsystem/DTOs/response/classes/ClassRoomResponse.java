package com.school.schoolmanagementsystem.DTOs.response.classes;

import com.school.schoolmanagementsystem.DTOs.response.users.TeacherResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassRoomResponse {
    private Long id;
    private String name;
    private String academicYear;
    private TeacherResponse classTeacher;  // simplified teacher info
    private long studentCount;              // optional, can be computed
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
