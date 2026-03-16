package com.school.schoolmanagementsystem.Repository.users;

import com.school.schoolmanagementsystem.Entity.users.Parent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, Long> {

    @Query("SELECT p FROM Parent p WHERE p.deleted = false")
    Page<Parent> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Parent p WHERE p.id = :id AND p.deleted = false")
    Optional<Parent> findActiveById(@Param("id") Long id);
}
