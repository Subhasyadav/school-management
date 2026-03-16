//package com.school.schoolmanagementsystem.Repository;
//
//import com.school.schoolmanagementsystem.Entity.Subject;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface SubjectRepository extends JpaRepository<Subject, Long> {
//    boolean existsByName(String name);
//}

package com.school.schoolmanagementsystem.Repository.subjects;

import com.school.schoolmanagementsystem.Entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    @Query("SELECT s FROM Subject s WHERE s.deleted = false")
    Page<Subject> findAllActive(Pageable pageable);

    @Query("SELECT s FROM Subject s WHERE s.id = :id AND s.deleted = false")
    Optional<Subject> findActiveById(@Param("id") Long id);

    boolean existsByNameAndDeletedFalse(String name);

    @Modifying
    @Query("UPDATE Subject s SET s.deleted = true WHERE s.id = :id")
    void softDeleteById(@Param("id") Long id);
}