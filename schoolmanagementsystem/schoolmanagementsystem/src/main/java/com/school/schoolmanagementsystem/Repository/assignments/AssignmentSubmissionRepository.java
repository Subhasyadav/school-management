//package com.school.schoolmanagementsystem.Repository;
//
//import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.Optional;
//
//public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
//
//    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
//
//    Page<AssignmentSubmission> findByAssignmentId(Long assignmentId, Pageable pageable);
//
//    Page<AssignmentSubmission> findByStudentId(Long studentId, Pageable pageable);
//
//    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.gradedBy IS NULL AND s.assignment.teacher.id = :teacherId")
//    long countByGradedByIsNullAndAssignmentTeacherId(@Param("teacherId") Long teacherId);
//    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.classRoom.id = :classId AND s.grade IS NULL")
//    long countByAssignmentClassRoomIdAndGradeIsNull(@Param("classId") Long classId);
//    @Query("SELECT AVG(s.grade) FROM AssignmentSubmission s WHERE s.student.id = :studentId AND s.grade IS NOT NULL")
//    Double calculateAverageGradeByStudent(@Param("studentId") Long studentId);
//}


package com.school.schoolmanagementsystem.Repository.assignments;

import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {

    // Existing methods
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

    Page<AssignmentSubmission> findByAssignmentId(Long assignmentId, Pageable pageable);

    Page<AssignmentSubmission> findByStudentId(Long studentId, Pageable pageable);

    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.gradedBy IS NULL AND s.assignment.teacher.id = :teacherId")
    long countByGradedByIsNullAndAssignmentTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.classRoom.id = :classId AND s.grade IS NULL")
    long countByAssignmentClassRoomIdAndGradeIsNull(@Param("classId") Long classId);

    @Query("SELECT AVG(s.grade) FROM AssignmentSubmission s WHERE s.student.id = :studentId AND s.grade IS NOT NULL")
    Double calculateAverageGradeByStudent(@Param("studentId") Long studentId);

    // New methods for versioning and analytics
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentIdOrderByVersionDesc(Long assignmentId, Long studentId);

    List<AssignmentSubmission> findAllByAssignmentIdAndStudentIdOrderByVersionDesc(Long assignmentId, Long studentId);

    long countByAssignmentTeacherIdAndGradedByIsNull(Long teacherId);

    @Query("SELECT AVG(s.grade) FROM AssignmentSubmission s WHERE s.assignment.classRoom.id = :classId AND s.grade IS NOT NULL")
    Double averageGradeByClass(@Param("classId") Long classId);

    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId")
    long countSubmissionsForAssignment(@Param("assignmentId") Long assignmentId);

    long countByAssignmentTeacherId(Long teacherId);
}