package com.school.schoolmanagementsystem.Repository.attendance;

import com.school.schoolmanagementsystem.Entity.attendance.TeacherAttendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {
    Page<TeacherAttendance> findByTeacherId(Long teacherId, Pageable pageable);
    Optional<TeacherAttendance> findByTeacherIdAndDate(Long teacherId, LocalDate date);
    boolean existsByTeacherIdAndDate(Long teacherId, LocalDate date);
}
