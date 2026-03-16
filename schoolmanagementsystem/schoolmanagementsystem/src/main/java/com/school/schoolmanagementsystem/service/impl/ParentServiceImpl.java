package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.Repository.users.ParentStudentRepository;
import com.school.schoolmanagementsystem.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service("parentService")   // Explicit bean name to match SpEL @parentService
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final ParentStudentRepository parentStudentRepository;

    @Override
    public boolean isParentOf(Long studentId, Long parentId) {
        // Checks if there is a record linking the given parent to the given student
        return parentStudentRepository.existsByParentIdAndStudentId(parentId, studentId);
    }
}
