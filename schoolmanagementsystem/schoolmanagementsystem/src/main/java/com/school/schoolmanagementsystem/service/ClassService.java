package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.DTOs.response.classes.ClassRoomResponse;
import com.school.schoolmanagementsystem.DTOs.response.subject.ClassSubjectResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.StudentResponse;
import com.school.schoolmanagementsystem.DTOs.request.classes.ClassCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.classes.ClassUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClassService {

    Page<ClassRoomResponse> getAllClasses(Pageable pageable);

    ClassRoomResponse getClassById(Long id);

    ClassRoomResponse createClass(ClassCreateRequest request);

    ClassRoomResponse updateClass(Long id, ClassUpdateRequest request);

    void deleteClass(Long id);

    Page<StudentResponse> getStudentsInClass(Long classId, Pageable pageable);

    void enrollStudent(Long classId, Long studentId);

    void removeStudentFromClass(Long classId, Long studentId);

    Page<ClassSubjectResponse> getSubjectsInClass(Long classId, Pageable pageable);

    void assignTeacherToSubject(Long classId, Long subjectId, Long teacherId);
}
