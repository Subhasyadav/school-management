package com.school.schoolmanagementsystem.Repository.grades;

import com.school.schoolmanagementsystem.Entity.grade.Grade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    // Find grades by student (for student/parent view)
    Page<Grade> findByStudentId(Long studentId, Pageable pageable);

    // Find grades by class (for teacher view)
    Page<Grade> findByClassRoomId(Long classId, Pageable pageable);

    // Find grades by class and subject (filter)
    Page<Grade> findByClassRoomIdAndSubjectId(Long classId, Long subjectId, Pageable pageable);

    // Custom filter using JPQL
    @Query("SELECT g FROM Grade g WHERE " +
            "(:classId IS NULL OR g.classRoom.id = :classId) AND " +
            "(:subjectId IS NULL OR g.subject.id = :subjectId) AND " +
            "(:studentId IS NULL OR g.student.id = :studentId)")
    Page<Grade> findByFilters(@Param("classId") Long classId,
                              @Param("subjectId") Long subjectId,
                              @Param("studentId") Long studentId,
                              Pageable pageable);
}
