package com.school.schoolmanagementsystem.Repository.users;

import com.school.schoolmanagementsystem.Entity.users.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    @Query("SELECT t FROM Teacher t WHERE t.deleted = false")
    Page<Teacher> findAllActive(Pageable pageable);


    @Query("SELECT t FROM Teacher t WHERE t.id = :id AND t.deleted = false")
    Optional<Teacher> findActiveById(@Param("id") Long id);

//    @Query("SELECT t FROM Teacher t WHERE t.id = :id AND t.deleted = false")
//    Teacher findActiveById(@Param("id") Long id);
}
