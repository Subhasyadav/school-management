package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.response.subject.SubjectResponse;
import com.school.schoolmanagementsystem.DTOs.request.SubjectRequest;
import com.school.schoolmanagementsystem.Entity.Subject;
import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    public Page<SubjectResponse> getAllSubjects(Pageable pageable) {
        return subjectRepository.findAllActive(pageable)
                .map(this::mapToSubjectResponse);
    }

    @Override
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return mapToSubjectResponse(subject);
    }

    @Override
    public SubjectResponse createSubject(SubjectRequest request) {
        // Check uniqueness
        if (subjectRepository.existsByNameAndDeletedFalse(request.getName())) {
            throw new DuplicateResourceException("Subject with name '" + request.getName() + "' already exists");
        }

        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setCode(request.getCode());

        Subject saved = subjectRepository.save(subject);
        return mapToSubjectResponse(saved);
    }

    @Override
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        // If name is being changed, check uniqueness
        if (request.getName() != null && !request.getName().equals(subject.getName())) {
            if (subjectRepository.existsByNameAndDeletedFalse(request.getName())) {
                throw new DuplicateResourceException("Subject with name '" + request.getName() + "' already exists");
            }
            subject.setName(request.getName());
        }

        if (request.getCode() != null) {
            subject.setCode(request.getCode());
        }

        return mapToSubjectResponse(subject);
    }

    @Override
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.softDeleteById(id);
    }

    // ---------- Mapping Helper ----------
    private SubjectResponse mapToSubjectResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .code(subject.getCode())
                .build();
    }
}
