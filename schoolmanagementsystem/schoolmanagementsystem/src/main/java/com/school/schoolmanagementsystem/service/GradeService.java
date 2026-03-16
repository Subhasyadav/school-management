package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.DTOs.response.GradeResponse;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeFilter;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GradeService {

    Page<GradeResponse> getGrades(GradeFilter filter, Pageable pageable);

    Page<GradeResponse> getGradesByStudent(Long studentId, Pageable pageable);

    GradeResponse getGradeById(Long id);

    GradeResponse createGrade(GradeCreateRequest request, Long teacherId);

    GradeResponse updateGrade(Long id, GradeUpdateRequest request, Long teacherId);

    void deleteGrade(Long id, Long teacherId); // teacher or admin
}
