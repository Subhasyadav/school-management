package com.school.schoolmanagementsystem.service;

public interface ParentService {
    boolean isParentOf(Long studentId, Long parentId);
}
