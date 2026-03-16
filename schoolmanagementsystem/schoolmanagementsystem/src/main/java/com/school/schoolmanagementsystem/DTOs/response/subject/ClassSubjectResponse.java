package com.school.schoolmanagementsystem.DTOs.response.subject;

import com.school.schoolmanagementsystem.DTOs.response.users.TeacherResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSubjectResponse {
    private Long id;
    private SubjectResponse subject;
    private TeacherResponse teacher;   // teacher teaching this subject
}
