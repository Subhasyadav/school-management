package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.response.GradeResponse;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeFilter;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeUpdateRequest;
import com.school.schoolmanagementsystem.Entity.*;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.grade.Grade;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Repository.classes.ClassRoomRepository;
import com.school.schoolmanagementsystem.Repository.grades.GradeRepository;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.Repository.users.StudentRepository;
import com.school.schoolmanagementsystem.Repository.users.TeacherRepository;
import com.school.schoolmanagementsystem.exception.BadRequestException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class GradeServiceImpl implements GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public Page<GradeResponse> getGrades(GradeFilter filter, Pageable pageable) {
        return gradeRepository.findByFilters(
                filter.getClassId(),
                filter.getSubjectId(),
                filter.getStudentId(),
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public Page<GradeResponse> getGradesByStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return gradeRepository.findByStudentId(studentId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public GradeResponse getGradeById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        return mapToResponse(grade);
    }

    @Override
    public GradeResponse createGrade(GradeCreateRequest request, Long teacherId) {
        // Validate entities
        Student student = studentRepository.findActiveById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
        ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        // Validate marks
        if (request.getMarksObtained() > request.getMaxMarks()) {
            throw new BadRequestException("Marks obtained cannot exceed maximum marks");
        }

        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setSubject(subject);
        grade.setClassRoom(classRoom);
        grade.setExamName(request.getExamName());
        grade.setExamDate(request.getExamDate());
        grade.setMarksObtained(request.getMarksObtained());
        grade.setMaxMarks(request.getMaxMarks());
        grade.setGradeLetter(request.getGradeLetter());
        grade.setRemarks(request.getRemarks());
        grade.setEnteredBy(teacher);

        Grade saved = gradeRepository.save(grade);
        return mapToResponse(saved);
    }

    @Override
    public GradeResponse updateGrade(Long id, GradeUpdateRequest request, Long teacherId) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));

        // Optional: check if teacher is allowed to update (e.g., same teacher who entered, or admin)
        // For simplicity, we allow any teacher to update, but could add check.

        if (request.getExamName() != null) grade.setExamName(request.getExamName());
        if (request.getExamDate() != null) grade.setExamDate(request.getExamDate());
        if (request.getMarksObtained() != null) {
            Double max = request.getMaxMarks() != null ? request.getMaxMarks() : grade.getMaxMarks();
            if (request.getMarksObtained() > max) {
                throw new BadRequestException("Marks obtained cannot exceed maximum marks");
            }
            grade.setMarksObtained(request.getMarksObtained());
        }
        if (request.getMaxMarks() != null) {
            if (grade.getMarksObtained() > request.getMaxMarks()) {
                throw new BadRequestException("Marks obtained cannot exceed new maximum marks");
            }
            grade.setMaxMarks(request.getMaxMarks());
        }
        if (request.getGradeLetter() != null) grade.setGradeLetter(request.getGradeLetter());
        if (request.getRemarks() != null) grade.setRemarks(request.getRemarks());

        return mapToResponse(grade);
    }

    @Override
    public void deleteGrade(Long id, Long teacherId) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        // Authorization can be handled at controller level with @PreAuthorize
        gradeRepository.delete(grade);
    }

    // ---------- Mapping Helpers ----------
    private GradeResponse mapToResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .studentId(grade.getStudent().getId())
                .studentName(grade.getStudent().getFirstName() + " " + grade.getStudent().getLastName())
                .subjectId(grade.getSubject().getId())
                .subjectName(grade.getSubject().getName())
                .classId(grade.getClassRoom().getId())
                .className(grade.getClassRoom().getName())
                .examName(grade.getExamName())
                .examDate(grade.getExamDate())
                .marksObtained(grade.getMarksObtained())
                .maxMarks(grade.getMaxMarks())
                .gradeLetter(grade.getGradeLetter())
                .remarks(grade.getRemarks())
                .enteredBy(grade.getEnteredBy() != null ?
                        grade.getEnteredBy().getFirstName() + " " + grade.getEnteredBy().getLastName() : null)
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }
}
