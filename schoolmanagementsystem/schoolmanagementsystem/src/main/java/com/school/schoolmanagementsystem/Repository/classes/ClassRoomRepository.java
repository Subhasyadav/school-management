package com.school.schoolmanagementsystem.Repository.classes;

import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {

    @Query("SELECT c FROM ClassRoom c WHERE c.deleted = false")
    Page<ClassRoom> findAllActive(Pageable pageable);

    @Query("SELECT c FROM ClassRoom c WHERE c.id = :id AND c.deleted = false")
    Optional<ClassRoom> findActiveById(@Param("id") Long id);

    boolean existsByNameAndAcademicYearAndDeletedFalse(String name, String academicYear);

//    @Modifying
//    @Query("UPDATE ClassRoom c SET c.deleted = true WHERE c.id = :id")
//    void softDeleteById(@Param("id") Long id);

    @Modifying
    @Query("UPDATE ClassRoom c SET c.deleted = true WHERE c.id = :id")
    void softDeleteById(@Param("id") Long id);

    long countByDeletedFalse();
//    List<ClassRoom> findByTeacherId(Long teacherId); // via class teacher or class subjects (use @Query)
    @Query("SELECT c FROM ClassRoom c WHERE c.classTeacher.id = :teacherId OR c.id IN (SELECT cs.classRoom.id FROM ClassSubject cs WHERE cs.teacher.id = :teacherId)")
    List<ClassRoom> findByTeacherId(@Param("teacherId") Long teacherId);
}