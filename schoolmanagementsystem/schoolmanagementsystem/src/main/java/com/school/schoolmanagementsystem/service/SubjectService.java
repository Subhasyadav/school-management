package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.DTOs.response.subject.SubjectResponse;
import com.school.schoolmanagementsystem.DTOs.request.SubjectRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubjectService {

    Page<SubjectResponse> getAllSubjects(Pageable pageable);

    SubjectResponse getSubjectById(Long id);

    SubjectResponse createSubject(SubjectRequest request);

    SubjectResponse updateSubject(Long id, SubjectRequest request);

    void deleteSubject(Long id);
}
