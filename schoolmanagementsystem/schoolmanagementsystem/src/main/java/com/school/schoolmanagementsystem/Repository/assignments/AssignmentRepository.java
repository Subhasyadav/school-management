//package com.school.schoolmanagementsystem.Repository;
//
//import com.school.schoolmanagementsystem.Entity.assignment.Assignment;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
//
//    Page<Assignment> findByClassRoomId(Long classId, Pageable pageable);
//
//    @Query("SELECT a FROM Assignment a WHERE a.classRoom.id IN " +
//            "(SELECT e.classRoom.id FROM Enrollment e WHERE e.student.id = :studentId)")
//    Page<Assignment> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);
//
//    long countByCreatedAtAfter(LocalDateTime dateTime);
//    long countByTeacherIdAndDueDateBetween(Long teacherId, LocalDate start, LocalDate end);
//    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.classRoom.id = :classId AND a.id NOT IN (SELECT s.assignment.id FROM AssignmentSubmission s WHERE s.student.id = :studentId)")
//    long countByClassRoomIdAndStudentNotSubmitted(@Param("classId") Long classId, @Param("studentId") Long studentId);
//    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.classRoom.id = :classId AND a.dueDate BETWEEN :start AND :end AND a.id NOT IN (SELECT s.assignment.id FROM AssignmentSubmission s WHERE s.student.id = :studentId)")
//    long countByClassRoomIdAndDueDateBetweenAndStudentNotSubmitted(@Param("classId") Long classId, @Param("start") LocalDate start, @Param("end") LocalDate end, @Param("studentId") Long studentId);
//}


package com.school.schoolmanagementsystem.Repository.assignments;

import com.school.schoolmanagementsystem.Entity.assignment.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Existing methods
    Page<Assignment> findByClassRoomId(Long classId, Pageable pageable);

    @Query("SELECT a FROM Assignment a WHERE a.classRoom.id IN " +
            "(SELECT e.classRoom.id FROM Enrollment e WHERE e.student.id = :studentId)")
    Page<Assignment> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    long countByCreatedAtAfter(LocalDateTime dateTime);
    long countByTeacherIdAndDueDateBetween(Long teacherId, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.classRoom.id = :classId AND a.id NOT IN (SELECT s.assignment.id FROM AssignmentSubmission s WHERE s.student.id = :studentId)")
    long countByClassRoomIdAndStudentNotSubmitted(@Param("classId") Long classId, @Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.classRoom.id = :classId AND a.dueDate BETWEEN :start AND :end AND a.id NOT IN (SELECT s.assignment.id FROM AssignmentSubmission s WHERE s.student.id = :studentId)")
    long countByClassRoomIdAndDueDateBetweenAndStudentNotSubmitted(@Param("classId") Long classId, @Param("start") LocalDate start, @Param("end") LocalDate end, @Param("studentId") Long studentId);

    // New methods for soft delete and permissions
    Page<Assignment> findByClassRoomIdAndDeletedFalse(Long classId, Pageable pageable);

    Page<Assignment> findByTeacherIdAndDeletedFalse(Long teacherId, Pageable pageable);

    @Query("SELECT a FROM Assignment a WHERE a.classRoom.id IN " +
            "(SELECT cs.classRoom.id FROM ClassSubject cs WHERE cs.teacher.id = :teacherId) AND a.deleted = false")
    Page<Assignment> findByTeacherTeachingClasses(@Param("teacherId") Long teacherId, Pageable pageable);

    @Query("SELECT a FROM Assignment a WHERE a.classRoom.classTeacher.id = :classTeacherId AND a.deleted = false")
    Page<Assignment> findByClassTeacherId(@Param("classTeacherId") Long classTeacherId, Pageable pageable);

    @Query("SELECT COUNT(cs) > 0 FROM ClassSubject cs WHERE cs.classRoom.id = :classId AND cs.subject.id = :subjectId AND cs.teacher.id = :teacherId")
    boolean isTeacherAssignedToClassSubject(@Param("classId") Long classId, @Param("subjectId") Long subjectId, @Param("teacherId") Long teacherId);

    Optional<Assignment> findByIdAndDeletedFalse(Long id);

    Page<Assignment> findAllByDeletedFalse(Pageable pageable);

    @Modifying
    @Query("UPDATE Assignment a SET a.deleted = true WHERE a.id = :id")
    void softDeleteById(@Param("id") Long id);

    @Query("SELECT DISTINCT a FROM Assignment a JOIN a.classRoom c JOIN c.enrollments e WHERE e.student.id IN :studentIds AND a.deleted = false")
    Page<Assignment> findByStudentIds(@Param("studentIds") List<Long> studentIds, Pageable pageable);

    long countByTeacherIdAndDeletedFalse(Long teacherId);

    // NEW: Published assignments for a single student
    @Query("SELECT a FROM Assignment a WHERE a.classRoom.id IN " +
            "(SELECT e.classRoom.id FROM Enrollment e WHERE e.student.id = :studentId) " +
            "AND a.status = 'PUBLISHED' AND a.deleted = false")
    Page<Assignment> findPublishedByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    // NEW: Published assignments for multiple student IDs (e.g., parent's children)
    @Query("SELECT DISTINCT a FROM Assignment a JOIN a.classRoom c JOIN c.enrollments e " +
            "WHERE e.student.id IN :studentIds AND a.status = 'PUBLISHED' AND a.deleted = false")
    Page<Assignment> findPublishedByStudentIds(@Param("studentIds") List<Long> studentIds, Pageable pageable);
}