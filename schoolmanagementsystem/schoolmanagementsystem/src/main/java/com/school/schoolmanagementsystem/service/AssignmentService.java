//package com.school.schoolmanagementsystem.service;
//
//import com.school.schoolmanagementsystem.DTOs.response.assignment.AssignmentResponse;
//import com.school.schoolmanagementsystem.DTOs.response.assignment.SubmissionResponse;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentCreateRequest;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentUpdateRequest;
//import com.school.schoolmanagementsystem.DTOs.request.grades.GradeSubmissionRequest;
//import com.school.schoolmanagementsystem.DTOs.request.assignment.SubmissionRequest;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//
//import java.io.IOException;
//
//public interface AssignmentService {
//
//    // Assignment CRUD
//    Page<AssignmentResponse> getAssignments(Long classId, Long studentId, Pageable pageable);
//
//    AssignmentResponse getAssignmentById(Long id);
//
//    AssignmentResponse createAssignment(AssignmentCreateRequest request, Long teacherId) throws IOException;
//
//    AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request, Long teacherId) throws IOException;
//
//    void deleteAssignment(Long id, Long teacherId);
//
//    // Submissions
//    Page<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId, Pageable pageable);
//
//    SubmissionResponse submitAssignment(Long assignmentId, Long studentId, SubmissionRequest request) throws IOException;
//
//    SubmissionResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request, Long teacherId);
//
//    Page<SubmissionResponse> getSubmissionsByStudent(Long studentId, Pageable pageable);
//}

package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.DTOs.response.assignment.AssignmentResponse;
import com.school.schoolmanagementsystem.DTOs.response.assignment.SubmissionResponse;
import com.school.schoolmanagementsystem.DTOs.response.classes.TeacherWorkloadResponse;
import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.AssignmentUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.grades.GradeSubmissionRequest;
import com.school.schoolmanagementsystem.DTOs.request.assignment.SubmissionRequest;
import com.school.schoolmanagementsystem.Entity.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;

public interface AssignmentService {

    // ---------- Assignments ----------
    Page<AssignmentResponse> getAssignments(User currentUser, Long classId, Long studentId, Pageable pageable);

    AssignmentResponse getAssignmentById(Long id, User currentUser);

    AssignmentResponse createAssignment(AssignmentCreateRequest request, Long teacherId) throws IOException;

    AssignmentResponse updateAssignment(Long id, AssignmentUpdateRequest request, Long teacherId) throws IOException;

    void deleteAssignment(Long id, Long teacherId);

    AssignmentResponse publishAssignment(Long id, Long teacherId);

    // ---------- Submissions ----------
    Page<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId, User currentUser, Pageable pageable);

    SubmissionResponse submitAssignment(Long assignmentId, Long studentId, SubmissionRequest request) throws IOException;

    SubmissionResponse gradeSubmission(Long submissionId, GradeSubmissionRequest request, Long teacherId);

    Page<SubmissionResponse> getSubmissionsByStudent(Long studentId, Pageable pageable);

    // ---------- Parent Access ----------
    Page<AssignmentResponse> getAssignmentsForParentChildren(Long parentId, Pageable pageable);

    // ---------- Analytics ----------
    Double getAverageGradeForClass(Long classId);

    Double getSubmissionRate(Long assignmentId);

    TeacherWorkloadResponse getTeacherWorkload(Long teacherId);
}
