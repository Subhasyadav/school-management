package com.school.schoolmanagementsystem.Repository.users;

import com.school.schoolmanagementsystem.Entity.users.ParentStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParentStudentRepository extends JpaRepository<ParentStudent, Long> {

    List<ParentStudent> findByStudentId(Long studentId);

    List<ParentStudent> findByParentId(Long parentId);

    boolean existsByParentIdAndStudentId(Long parentId, Long studentId);

    @Query("SELECT ps.student.id FROM ParentStudent ps WHERE ps.parent.id = :parentId")
    List<Long> findStudentIdsByParentId(@Param("parentId") Long parentId);
}
