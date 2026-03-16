package com.school.schoolmanagementsystem.Repository.attendance;

import com.school.schoolmanagementsystem.DTOs.response.attendance.AttendanceResponse;
import com.school.schoolmanagementsystem.Entity.attendance.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Page<Attendance> findByClassRoomIdAndDate(Long classId, LocalDate date, Pageable pageable);

    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);

    Optional<Attendance> findByStudentIdAndDateAndClassRoomId(Long studentId, LocalDate date, Long classId);

    @Query("SELECT (COUNT(CASE WHEN a.status = 'PRESENT' OR a.status = 'LATE' THEN 1 END) * 100.0 / COUNT(*)) FROM Attendance a WHERE a.student.id = :studentId AND a.date BETWEEN :startDate AND :endDate")
    double calculateAttendancePercentage(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Attendance> findByClassRoomIdAndDateBetween(Long classId, LocalDate startDate, LocalDate endDate);
}
