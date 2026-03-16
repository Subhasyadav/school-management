package com.school.schoolmanagementsystem.Repository.classes;

import com.school.schoolmanagementsystem.Entity.classes.Enrollment;
import com.school.schoolmanagementsystem.Enum.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByClassRoomIdAndStatus(Long classId, EnrollmentStatus status, Pageable pageable);

    Optional<Enrollment> findByStudentIdAndClassRoomId(Long studentId, Long classId);

    boolean existsByStudentIdAndClassRoomId(Long studentId, Long classId);

//    boolean existsByStudentIdAndClassRoomId(Long studentId, Long classId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.classRoom.id = :classId AND e.status = :status")
    long countByClassRoomIdAndStatus(@Param("classId") long classId, @Param("status") EnrollmentStatus status);

    long countByEnrollmentDateAfter(LocalDate date);
    long countByClassRoomIdAndStatus(Long classId, EnrollmentStatus status);
    Optional<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.classRoom.id IN :classIds AND e.status = :status")
    long countByClassIdsAndStatus(@Param("classIds") List<Long> classIds, @Param("status") EnrollmentStatus status);

//    long countByClassRoomIdAndStatus(Long classId, EnrollmentStatus status);

}
