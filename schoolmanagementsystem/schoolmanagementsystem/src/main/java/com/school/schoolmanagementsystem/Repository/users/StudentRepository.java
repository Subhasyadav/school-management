package com.school.schoolmanagementsystem.Repository.users;

//import com.school.entity.Student;
import com.school.schoolmanagementsystem.Entity.users.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find all active (non-deleted) students with pagination
    @Query("SELECT s FROM Student s WHERE s.deleted = false")
    Page<Student> findAllActive(Pageable pageable);

    // Find a specific active student by ID
    @Query("SELECT s FROM Student s WHERE s.id = :id AND s.deleted = false")
    Optional<Student> findActiveById(@Param("id") Long id);

    // In StudentRepository
    Page<Student> findByIdIn(List<Long> ids, Pageable pageable);
}
