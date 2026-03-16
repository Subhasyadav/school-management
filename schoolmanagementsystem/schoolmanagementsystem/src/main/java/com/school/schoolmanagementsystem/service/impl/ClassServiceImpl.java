package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.request.classes.ClassCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.classes.ClassUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.response.classes.ClassRoomResponse;
import com.school.schoolmanagementsystem.DTOs.response.subject.ClassSubjectResponse;
import com.school.schoolmanagementsystem.DTOs.response.subject.SubjectResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.StudentResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.TeacherResponse;
import com.school.schoolmanagementsystem.Entity.*;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.classes.ClassSubject;
import com.school.schoolmanagementsystem.Entity.classes.Enrollment;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Enum.EnrollmentStatus;
import com.school.schoolmanagementsystem.Repository.classes.ClassRoomRepository;
import com.school.schoolmanagementsystem.Repository.classes.EnrollmentRepository;
import com.school.schoolmanagementsystem.Repository.subjects.ClassSubjectRepository;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.Repository.users.StudentRepository;
import com.school.schoolmanagementsystem.Repository.users.TeacherRepository;
import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassServiceImpl implements ClassService {

    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSubjectRepository classSubjectRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public Page<ClassRoomResponse> getAllClasses(Pageable pageable) {
        return classRoomRepository.findAllActive(pageable)
                .map(this::mapToClassResponse);
    }

    @Override
    public ClassRoomResponse getClassById(Long id) {
        ClassRoom classRoom = classRoomRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return mapToClassResponse(classRoom);
    }

    @Override
    public ClassRoomResponse createClass(ClassCreateRequest request) {
        // Check uniqueness of name + academicYear
        if (classRoomRepository.existsByNameAndAcademicYearAndDeletedFalse(request.getName(), request.getAcademicYear())) {
            throw new DuplicateResourceException("Class with name " + request.getName() + " already exists for year " + request.getAcademicYear());
        }

        ClassRoom classRoom = new ClassRoom();
        classRoom.setName(request.getName());
        classRoom.setAcademicYear(request.getAcademicYear());

        if (request.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findActiveById(request.getClassTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getClassTeacherId()));
            classRoom.setClassTeacher(teacher);
        }

        ClassRoom saved = classRoomRepository.save(classRoom);
        return mapToClassResponse(saved);
    }

    @Override
    public ClassRoomResponse updateClass(Long id, ClassUpdateRequest request) {
        ClassRoom classRoom = classRoomRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        if (request.getName() != null && !request.getName().equals(classRoom.getName())) {
            // Check uniqueness if name and academicYear both provided or unchanged
            String academicYear = request.getAcademicYear() != null ? request.getAcademicYear() : classRoom.getAcademicYear();
            if (classRoomRepository.existsByNameAndAcademicYearAndDeletedFalse(request.getName(), academicYear)) {
                throw new DuplicateResourceException("Class with name " + request.getName() + " already exists for year " + academicYear);
            }
            classRoom.setName(request.getName());
        }

        if (request.getAcademicYear() != null) {
            classRoom.setAcademicYear(request.getAcademicYear());
        }

        if (request.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findActiveById(request.getClassTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getClassTeacherId()));
            classRoom.setClassTeacher(teacher);
        }

        return mapToClassResponse(classRoom);
    }

    @Override
    public void deleteClass(Long id) {
        if (!classRoomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found with id: " + id);
        }
        classRoomRepository.softDeleteById(id);
    }

    @Override
    public Page<StudentResponse> getStudentsInClass(Long classId, Pageable pageable) {
        // Ensure class exists
        if (!classRoomRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with id: " + classId);
        }
        return enrollmentRepository.findByClassRoomIdAndStatus(classId, EnrollmentStatus.ACTIVE, pageable)
                .map(enrollment -> mapToStudentResponse(enrollment.getStudent()));
    }

    @Override
    public void enrollStudent(Long classId, Long studentId) {
        ClassRoom classRoom = classRoomRepository.findActiveById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        Student student = studentRepository.findActiveById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (enrollmentRepository.existsByStudentIdAndClassRoomId(studentId, classId)) {
            throw new DuplicateResourceException("Student already enrolled in this class");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassRoom(classRoom);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public void removeStudentFromClass(Long classId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndClassRoomId(studentId, classId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for student " + studentId + " in class " + classId));
        enrollmentRepository.delete(enrollment);  // or soft delete if needed
    }

    @Override
    public Page<ClassSubjectResponse> getSubjectsInClass(Long classId, Pageable pageable) {
        // For simplicity, we'll fetch all subjects for the class and map them.
        // Pagination can be added if needed, but here we just return all.
        List<ClassSubject> subjects = classSubjectRepository.findByClassRoomId(classId);
        return new PageImpl<>(subjects.stream().map(this::mapToClassSubjectResponse).collect(Collectors.toList()));
    }

    @Override
    public void assignTeacherToSubject(Long classId, Long subjectId, Long teacherId) {
        ClassRoom classRoom = classRoomRepository.findActiveById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));

        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        ClassSubject classSubject = classSubjectRepository.findByClassRoomIdAndSubjectId(classId, subjectId)
                .orElseGet(() -> {
                    ClassSubject cs = new ClassSubject();
                    cs.setClassRoom(classRoom);
                    cs.setSubject(subject);
                    return cs;
                });

        classSubject.setTeacher(teacher);
        classSubjectRepository.save(classSubject);
    }

    // ---------- Mapping Helpers ----------

    private ClassRoomResponse mapToClassResponse(ClassRoom classRoom) {
        long studentCount = enrollmentRepository.countByClassRoomIdAndStatus(classRoom.getId(), EnrollmentStatus.ACTIVE); // need to add this method
        return ClassRoomResponse.builder()
                .id(classRoom.getId())
                .name(classRoom.getName())
                .academicYear(classRoom.getAcademicYear())
                .classTeacher(classRoom.getClassTeacher() != null ? mapToTeacherResponse(classRoom.getClassTeacher()) : null)
                .studentCount(studentCount)
                .createdAt(classRoom.getCreatedAt())
                .updatedAt(classRoom.getUpdatedAt())
                .build();
    }

    private TeacherResponse mapToTeacherResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .email(teacher.getEmail())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .phone(teacher.getPhone())
                .role(teacher.getRole())
                .qualification(teacher.getQualification())
                .hireDate(teacher.getHireDate())
                .build();
    }

    private StudentResponse mapToStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .phone(student.getPhone())
                .role(student.getRole())
                .enrollmentDate(student.getEnrollmentDate())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .build();
    }

    private ClassSubjectResponse mapToClassSubjectResponse(ClassSubject cs) {
        return ClassSubjectResponse.builder()
                .id(cs.getId())
                .subject(mapToSubjectResponse(cs.getSubject()))
                .teacher(cs.getTeacher() != null ? mapToTeacherResponse(cs.getTeacher()) : null)
                .build();
    }

    private SubjectResponse mapToSubjectResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .code(subject.getCode())
                .build();
    }
}
