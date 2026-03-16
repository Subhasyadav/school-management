//package com.school.schoolmanagementsystem.service.impl;
//
//import com.school.schoolmanagementsystem.DTOs.response.assignment.AssignmentResponse;
//import com.school.schoolmanagementsystem.DTOs.response.assignment.SubmissionResponse;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentCreateRequest;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentUpdateRequest;
//import com.school.schoolmanagementsystem.DTOs.request.grades.GradeSubmissionRequest;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.SubmissionRequest;
//import com.school.schoolmanagementsystem.Entity.*;
//import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
//import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
//import com.school.schoolmanagementsystem.Repository.*;
//import com.school.schoolmanagementsystem.service.AssignmentService;
//import com.school.schoolmanagementsystem.service.FileStorageService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.io.IOException;
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class AssignmentServiceImpl implements AssignmentService {
//
//    private final AssignmentRepository assignmentRepository;
//    private final AssignmentSubmissionRepository submissionRepository;
//    private final ClassRoomRepository classRoomRepository;
//    private final SubjectRepository subjectRepository;
//    private final TeacherRepository teacherRepository;
//    private final StudentRepository studentRepository;
//    private final FileStorageService fileStorageService;
//
//    // ---------- Assignment CRUD ----------
//    @Override
//    public Page<AssignmentResponse> getAssignments(Long classId, Long studentId, Pageable pageable) {
//        if (classId != null) {
//            return assignmentRepository.findByClassRoomId(classId, pageable)
//                    .map(this::mapToAssignmentResponse);
//        } else if (studentId != null) {
//            return assignmentRepository.findByStudentId(studentId, pageable)
//                    .map(this::mapToAssignmentResponse);
//        } else {
//            return assignmentRepository.findAll(pageable)
//                    .map(this::mapToAssignmentResponse);
//        }
//    }
//
//    @Override
//    public AssignmentResponse getAssignmentById(Long id) {
//        Assignment assignment = assignmentRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
//        return mapToAssignmentResponse(assignment);
//    }
//
//    @Override
//    public AssignmentResponse createAssignment(AssignmentCreateRequest request, Long teacherId) throws IOException {
//        ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
//                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
//        Subject subject = subjectRepository.findById(request.getSubjectId())
//                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
//        Teacher teacher = teacherRepository.findActiveById(teacherId)
//                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
//
//        Assignment assignment = new Assignment();
//        assignment.setTitle(request.getTitle());
//        assignment.setDescription(request.getDescription());
//        assignment.setClassRoom(classRoom);
//        assignment.setSubject(subject);
//        assignment.setTeacher(teacher);
//        assignment.setDueDate(request.getDueDate());
//
//        if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
//            String filePath = fileStorageService.storeFile(request.getAttachment());
//            assignment.setAttachmentUrl(filePath);
//        }
//
//        Assignment saved = assignmentRepository.save(assignment);
//        return mapToAssignmentResponse(saved);
//    }
//
//    @Override
//    public AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request, Long teacherId) throws IOException {
//        Assignment assignment = assignmentRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
//
//        // Optional: check if teacher owns this assignment (teacherId == assignment.getTeacher().getId())
//
//        if (request.getTitle() != null) assignment.setTitle(request.getTitle());
//        if (request.getDescription() != null) assignment.setDescription(request.getDescription());
//        if (request.getClassId() != null) {
//            ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
//            assignment.setClassRoom(classRoom);
//        }
//        if (request.getSubjectId() != null) {
//            Subject subject = subjectRepository.findById(request.getSubjectId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
//            assignment.setSubject(subject);
//        }
//        if (request.getDueDate() != null) assignment.setDueDate(request.getDueDate());
//        if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
//            String filePath = fileStorageService.storeFile(request.getAttachment());
//            assignment.setAttachmentUrl(filePath);
//        }
//
//        return mapToAssignmentResponse(assignment);
//    }
//
//    @Override
//    public void deleteAssignment(Long id, Long teacherId) {
//        Assignment assignment = assignmentRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
//        // Authorization check (teacher owns it or admin) can be done at controller level
//        assignmentRepository.delete(assignment);
//    }
//
//    // ---------- Submissions ----------
//    @Override
//    public Page<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId, Pageable pageable) {
//        if (!assignmentRepository.existsById(assignmentId)) {
//            throw new ResourceNotFoundException("Assignment not found with id: " + assignmentId);
//        }
//        return submissionRepository.findByAssignmentId(assignmentId, pageable)
//                .map(this::mapToSubmissionResponse);
//    }
//
//    @Override
//    public SubmissionResponse submitAssignment(Long assignmentId, Long studentId, SubmissionRequest request) throws IOException {
//        Assignment assignment = assignmentRepository.findById(assignmentId)
//                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
//        Student student = studentRepository.findActiveById(studentId)
//                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
//
//        // Check if already submitted
//        if (submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId).isPresent()) {
//            throw new DuplicateResourceException("You have already submitted this assignment");
//        }
//
//        // Store file
//        String fileUrl = fileStorageService.storeFile(request.getFile());
//
//        AssignmentSubmission submission = new AssignmentSubmission();
//        submission.setAssignment(assignment);
//        submission.setStudent(student);
//        submission.setSubmissionDate(LocalDateTime.now());
//        submission.setFileUrl(fileUrl);
//
//        AssignmentSubmission saved = submissionRepository.save(submission);
//        return mapToSubmissionResponse(saved);
//    }
//
//    @Override
//    public SubmissionResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request, Long teacherId) {
//        AssignmentSubmission submission = submissionRepository.findById(submissionId)
//                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
//        Teacher teacher = teacherRepository.findActiveById(teacherId)
//                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
//
//        submission.setGrade(request.getGrade());
//        submission.setFeedback(request.getFeedback());
//        submission.setGradedBy(teacher);
//
//        return mapToSubmissionResponse(submission);
//    }
//
//    @Override
//    public Page<SubmissionResponse> getSubmissionsByStudent(Long studentId, Pageable pageable) {
//        if (!studentRepository.existsById(studentId)) {
//            throw new ResourceNotFoundException("Student not found with id: " + studentId);
//        }
//        return submissionRepository.findByStudentId(studentId, pageable)
//                .map(this::mapToSubmissionResponse);
//    }
//
//    // ---------- Mapping Helpers ----------
//    private AssignmentResponse mapToAssignmentResponse(Assignment assignment) {
//        return AssignmentResponse.builder()
//                .id(assignment.getId())
//                .title(assignment.getTitle())
//                .description(assignment.getDescription())
//                .classId(assignment.getClassRoom().getId())
//                .className(assignment.getClassRoom().getName())
//                .subjectId(assignment.getSubject().getId())
//                .subjectName(assignment.getSubject().getName())
//                .teacherId(assignment.getTeacher().getId())
//                .teacherName(assignment.getTeacher().getFirstName() + " " + assignment.getTeacher().getLastName())
//                .dueDate(assignment.getDueDate())
//                .attachmentUrl(assignment.getAttachmentUrl())
//                .submissionCount(assignment.getSubmissions().size())
//                .createdAt(assignment.getCreatedAt())
//                .updatedAt(assignment.getUpdatedAt())
//                .build();
//    }
//
//    private SubmissionResponse mapToSubmissionResponse(AssignmentSubmission submission) {
//        return SubmissionResponse.builder()
//                .id(submission.getId())
//                .assignmentId(submission.getAssignment().getId())
//                .assignmentTitle(submission.getAssignment().getTitle())
//                .studentId(submission.getStudent().getId())
//                .studentName(submission.getStudent().getFirstName() + " " + submission.getStudent().getLastName())
//                .submissionDate(submission.getSubmissionDate())
//                .fileUrl(submission.getFileUrl())
//                .grade(submission.getGrade())
//                .feedback(submission.getFeedback())
//                .gradedBy(submission.getGradedBy() != null ?
//                        submission.getGradedBy().getFirstName() + " " + submission.getGradedBy().getLastName() : null)
//                .createdAt(submission.getCreatedAt())
//                .updatedAt(submission.getUpdatedAt())
//                .build();
//    }
//}

package com.school.schoolmanagementsystem.service.impl.assignment;

//package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.response.assignment.AssignmentResponse;
import com.school.schoolmanagementsystem.DTOs.response.assignment.SubmissionResponse;
import com.school.schoolmanagementsystem.DTOs.response.classes.TeacherWorkloadResponse;
import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeSubmissionRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.SubmissionRequest;
import com.school.schoolmanagementsystem.Entity.*;
import com.school.schoolmanagementsystem.Entity.assignment.Assignment;
import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.grade.GradeAuditLog;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.Enum.AssignmentStatus;
import com.school.schoolmanagementsystem.Enum.EnrollmentStatus;
import com.school.schoolmanagementsystem.Enum.Role;
import com.school.schoolmanagementsystem.Repository.assignments.AssignmentRepository;
import com.school.schoolmanagementsystem.Repository.assignments.AssignmentSubmissionRepository;
import com.school.schoolmanagementsystem.Repository.classes.ClassRoomRepository;
import com.school.schoolmanagementsystem.Repository.classes.EnrollmentRepository;
import com.school.schoolmanagementsystem.Repository.grades.GradeAuditLogRepository;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.Repository.users.ParentStudentRepository;
import com.school.schoolmanagementsystem.Repository.users.StudentRepository;
import com.school.schoolmanagementsystem.Repository.users.TeacherRepository;
import com.school.schoolmanagementsystem.Repository.users.UserRepository;
import com.school.schoolmanagementsystem.exception.AccessDeniedException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.AssignmentService;
import com.school.schoolmanagementsystem.service.FileStorageService;
import com.school.schoolmanagementsystem.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;
    private final ParentStudentRepository parentStudentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeAuditLogRepository gradeAuditLogRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // ---------- Permission Helpers ----------

    private boolean canCreateAssignment(Long teacherId, Long classId, Long subjectId) {
        return assignmentRepository.isTeacherAssignedToClassSubject(classId, subjectId, teacherId);
    }

    private boolean canViewAssignment(User user, Assignment assignment) {
        if (user.getRole() == Role.ADMIN) return true;
        if (user.getRole() == Role.TEACHER) {
            Long teacherId = user.getId();
            return assignment.getTeacher().getId().equals(teacherId) ||
                    assignmentRepository.isTeacherAssignedToClassSubject(assignment.getClassRoom().getId(), assignment.getSubject().getId(), teacherId) ||
                    (assignment.getClassRoom().getClassTeacher() != null && assignment.getClassRoom().getClassTeacher().getId().equals(teacherId));
        }
        if (user.getRole() == Role.STUDENT) {
            return assignment.getStatus() == AssignmentStatus.PUBLISHED &&
                    enrollmentRepository.existsByStudentIdAndClassRoomId(user.getId(), assignment.getClassRoom().getId());
        }
        return false;
    }

    private boolean canEditAssignment(Long userId, Assignment assignment) {
        if (userId == null) return false;
        User user = userRepository.findActiveById(userId).orElse(null);
        if (user == null) return false;
        if (user.getRole() == Role.ADMIN) return true;
        if (user.getRole() == Role.TEACHER) {
            Long teacherId = userId;
            return assignment.getTeacher().getId().equals(teacherId) ||
                    (assignment.getClassRoom().getClassTeacher() != null && assignment.getClassRoom().getClassTeacher().getId().equals(teacherId));
        }
        return false;
    }

    private boolean canGradeSubmission(Long teacherId, AssignmentSubmission submission) {
        Assignment assignment = submission.getAssignment();
        return canEditAssignment(teacherId, assignment);
    }

    // ---------- Assignment Methods ----------

    @Override
    public Page<AssignmentResponse> getAssignments(User currentUser, Long classId, Long studentId, Pageable pageable) {
        if (currentUser.getRole() == Role.STUDENT) {
            // Student: only published assignments for their enrolled classes
            return assignmentRepository.findPublishedByStudentId(currentUser.getId(), pageable)
                    .map(this::mapToAssignmentResponse);
        } else if (currentUser.getRole() == Role.TEACHER) {
            Long teacherId = currentUser.getId();
            // Teacher: assignments they created OR teach in that class OR are class teacher
            return assignmentRepository.findByTeacherTeachingClasses(teacherId, pageable)
                    .map(this::mapToAssignmentResponse);
        } else if (currentUser.getRole() == Role.PARENT) {
            // Parent: only if studentId is provided and is their child
            if (studentId == null || !parentStudentRepository.existsByParentIdAndStudentId(currentUser.getId(), studentId)) {
                return Page.empty();
            }
            return assignmentRepository.findPublishedByStudentId(studentId, pageable)
                    .map(this::mapToAssignmentResponse);
        } else if (currentUser.getRole() == Role.ADMIN) {
            // Admin: all non-deleted assignments, optionally filtered
            if (classId != null) {
                return assignmentRepository.findByClassRoomIdAndDeletedFalse(classId, pageable)
                        .map(this::mapToAssignmentResponse);
            } else if (studentId != null) {
                return assignmentRepository.findByStudentId(studentId, pageable) // admin can see all, even drafts
                        .map(this::mapToAssignmentResponse);
            } else {
                return assignmentRepository.findAllByDeletedFalse(pageable)
                        .map(this::mapToAssignmentResponse);
            }
        }
        return Page.empty();
    }

    @Override
    public AssignmentResponse getAssignmentById(Long id, User currentUser) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        if (!canViewAssignment(currentUser, assignment)) {
            throw new AccessDeniedException("You do not have permission to view this assignment");
        }
        return mapToAssignmentResponse(assignment);
    }

    @Override
    public AssignmentResponse createAssignment(AssignmentCreateRequest request, Long teacherId) throws IOException {
        if (!canCreateAssignment(teacherId, request.getClassId(), request.getSubjectId())) {
            throw new AccessDeniedException("You are not authorized to create assignments for this class and subject");
        }

        ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setClassRoom(classRoom);
        assignment.setSubject(subject);
        assignment.setTeacher(teacher);
        assignment.setDueDate(request.getDueDate());
        assignment.setStatus(request.getStatus() != null ? request.getStatus() : AssignmentStatus.DRAFT);
        if (request.getStatus() == AssignmentStatus.PUBLISHED && request.getPublishDate() == null) {
            assignment.setPublishDate(LocalDateTime.now());
        } else {
            assignment.setPublishDate(request.getPublishDate());
        }
        assignment.setAllowLateSubmission(request.isAllowLateSubmission());
        assignment.setLatePenaltyPercent(request.getLatePenaltyPercent());
        assignment.setAnonymousGrading(request.isAnonymousGrading());

        if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
            String filePath = fileStorageService.storeFile(request.getAttachment());
            assignment.setAttachmentUrl(filePath);
        }

        Assignment saved = assignmentRepository.save(assignment);
        if (saved.getStatus() == AssignmentStatus.PUBLISHED) {
            notificationService.notifyAssignmentCreated(saved);
        }
        return mapToAssignmentResponse(saved);
    }

    @Override
    public AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request, Long teacherId) throws IOException {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        if (!canEditAssignment(teacherId, assignment)) {
            throw new AccessDeniedException("You do not have permission to update this assignment");
        }

        if (request.getTitle() != null) assignment.setTitle(request.getTitle());
        if (request.getDescription() != null) assignment.setDescription(request.getDescription());
        if (request.getClassId() != null) {
            ClassRoom classRoom = classRoomRepository.findActiveById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
            assignment.setClassRoom(classRoom);
        }
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
            assignment.setSubject(subject);
        }
        if (request.getDueDate() != null) assignment.setDueDate(request.getDueDate());
        if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
            String filePath = fileStorageService.storeFile(request.getAttachment());
            assignment.setAttachmentUrl(filePath);
        }
        if (request.getStatus() != null) assignment.setStatus(request.getStatus());
        if (request.getPublishDate() != null) assignment.setPublishDate(request.getPublishDate());
        // Use Boolean getters correctly (getAllowLateSubmission() not isAllowLateSubmission)
        if (request.getAllowLateSubmission() != null) {
            assignment.setAllowLateSubmission(request.getAllowLateSubmission());
        }
        if (request.getLatePenaltyPercent() != null) {
            assignment.setLatePenaltyPercent(request.getLatePenaltyPercent());
        }
        if (request.getAnonymousGrading() != null) {
            assignment.setAnonymousGrading(request.getAnonymousGrading());
        }

        return mapToAssignmentResponse(assignment);
    }

    @Override
    public void deleteAssignment(Long id, Long teacherId) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        if (!canEditAssignment(teacherId, assignment)) {
            throw new AccessDeniedException("You do not have permission to delete this assignment");
        }
        assignmentRepository.softDeleteById(id);
    }

    @Override
    public AssignmentResponse publishAssignment(Long id, Long teacherId) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        if (!canEditAssignment(teacherId, assignment)) {
            throw new AccessDeniedException("You do not have permission to publish this assignment");
        }
        assignment.setStatus(AssignmentStatus.PUBLISHED);
        if (assignment.getPublishDate() == null) {
            assignment.setPublishDate(LocalDateTime.now());
        }
        assignment = assignmentRepository.save(assignment);
        notificationService.notifyAssignmentCreated(assignment);
        return mapToAssignmentResponse(assignment);
    }

    // ---------- Submission Methods ----------

    @Override
    public Page<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId, User currentUser, Pageable pageable) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
        if (!canEditAssignment(currentUser.getId(), assignment)) {
            throw new AccessDeniedException("You do not have permission to view submissions for this assignment");
        }
        return submissionRepository.findByAssignmentId(assignmentId, pageable)
                .map(this::mapToSubmissionResponse);
    }

    @Override
    public SubmissionResponse submitAssignment(Long assignmentId, Long studentId, SubmissionRequest request) throws IOException {
        Assignment assignment = assignmentRepository.findByIdAndDeletedFalse(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
        Student student = studentRepository.findActiveById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (!enrollmentRepository.existsByStudentIdAndClassRoomId(studentId, assignment.getClassRoom().getId())) {
            throw new AccessDeniedException("You are not enrolled in the class for this assignment");
        }
        if (assignment.getStatus() != AssignmentStatus.PUBLISHED) {
            throw new IllegalStateException("Assignment is not yet published");
        }

        LocalDate today = LocalDate.now();
        boolean late = today.isAfter(assignment.getDueDate());
        if (late && !assignment.isAllowLateSubmission()) {
            throw new IllegalStateException("Submission deadline has passed and late submissions are not allowed");
        }

        List<AssignmentSubmission> previousSubmissions = submissionRepository.findAllByAssignmentIdAndStudentIdOrderByVersionDesc(assignmentId, studentId);
        int newVersion = previousSubmissions.isEmpty() ? 1 : previousSubmissions.get(0).getVersion() + 1;

        String fileUrl = fileStorageService.storeFile(request.getFile());

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setSubmissionDate(LocalDateTime.now());
        submission.setLate(late);
        submission.setVersion(newVersion);
        submission.setFileUrl(fileUrl);

        AssignmentSubmission saved = submissionRepository.save(submission);
        return mapToSubmissionResponse(saved);
    }

    @Override
    public SubmissionResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request, Long teacherId) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        if (!canGradeSubmission(teacherId, submission)) {
            throw new AccessDeniedException("You are not allowed to grade this submission");
        }

        GradeAuditLog log = new GradeAuditLog();
        log.setSubmission(submission);
        log.setOldGrade(submission.getGrade());
        log.setNewGrade(request.getGrade());
        log.setOldLetterGrade(submission.getLetterGrade());
        log.setNewLetterGrade(request.getLetterGrade());
        log.setOldFeedback(submission.getFeedback());
        log.setNewFeedback(request.getFeedback());
        log.setChangedBy(teacher);
        log.setChangedAt(LocalDateTime.now());
        gradeAuditLogRepository.save(log);

        submission.setGrade(request.getGrade());
        submission.setLetterGrade(request.getLetterGrade());
        submission.setGradeType(request.getGradeType());
        submission.setFeedback(request.getFeedback());
        submission.setGradedBy(teacher);

        AssignmentSubmission saved = submissionRepository.save(submission);
        notificationService.notifySubmissionGraded(saved);
        return mapToSubmissionResponse(saved);
    }

    @Override
    public Page<SubmissionResponse> getSubmissionsByStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return submissionRepository.findByStudentId(studentId, pageable)
                .map(this::mapToSubmissionResponse);
    }

    // ---------- Parent Access ----------

    @Override
    public Page<AssignmentResponse> getAssignmentsForParentChildren(Long parentId, Pageable pageable) {
        List<Long> childIds = parentStudentRepository.findStudentIdsByParentId(parentId);
        if (childIds.isEmpty()) {
            return Page.empty();
        }
        return assignmentRepository.findPublishedByStudentIds(childIds, pageable)
                .map(this::mapToAssignmentResponse);
    }

    // ---------- Analytics ----------

    @Override
    public Double getAverageGradeForClass(Long classId) {
        return submissionRepository.averageGradeByClass(classId);
    }

    @Override
    public Double getSubmissionRate(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        long totalStudents = enrollmentRepository.countByClassRoomIdAndStatus(assignment.getClassRoom().getId(), EnrollmentStatus.ACTIVE);
        if (totalStudents == 0) return 0.0;
        long submitted = submissionRepository.countSubmissionsForAssignment(assignmentId);
        return (double) submitted / totalStudents;
    }

    @Override
    public TeacherWorkloadResponse getTeacherWorkload(Long teacherId) {
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        long assignmentsCreated = assignmentRepository.countByTeacherIdAndDeletedFalse(teacherId);
        long pendingGrading = submissionRepository.countByAssignmentTeacherIdAndGradedByIsNull(teacherId);
        long totalSubmissions = submissionRepository.countByAssignmentTeacherId(teacherId);
        return TeacherWorkloadResponse.builder()
                .teacherId(teacherId)
                .teacherName(teacher.getFirstName() + " " + teacher.getLastName())
                .assignmentsCreated(assignmentsCreated)
                .submissionsPendingGrading(pendingGrading)
                .totalSubmissions(totalSubmissions)
                .build();
    }

    // ---------- Mapping Helpers ----------

    private AssignmentResponse mapToAssignmentResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .classId(assignment.getClassRoom().getId())
                .className(assignment.getClassRoom().getName())
                .subjectId(assignment.getSubject().getId())
                .subjectName(assignment.getSubject().getName())
                .teacherId(assignment.getTeacher().getId())
                .teacherName(assignment.getTeacher().getFirstName() + " " + assignment.getTeacher().getLastName())
                .dueDate(assignment.getDueDate())
                .attachmentUrl(assignment.getAttachmentUrl())
                .submissionCount(assignment.getSubmissions().size())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .status(assignment.getStatus())
                .publishDate(assignment.getPublishDate())
                .allowLateSubmission(assignment.isAllowLateSubmission())
                .latePenaltyPercent(assignment.getLatePenaltyPercent())
                .anonymousGrading(assignment.isAnonymousGrading())
                .deleted(assignment.isDeleted())
                .build();
    }

    private SubmissionResponse mapToSubmissionResponse(AssignmentSubmission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getFirstName() + " " + submission.getStudent().getLastName())
                .submissionDate(submission.getSubmissionDate())
                .fileUrl(submission.getFileUrl())
                .grade(submission.getGrade())
                .feedback(submission.getFeedback())
                .gradedBy(submission.getGradedBy() != null ?
                        submission.getGradedBy().getFirstName() + " " + submission.getGradedBy().getLastName() : null)
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .late(submission.isLate())
                .version(submission.getVersion())
                .letterGrade(submission.getLetterGrade())
                .gradeType(submission.getGradeType())
                .build();
    }
}