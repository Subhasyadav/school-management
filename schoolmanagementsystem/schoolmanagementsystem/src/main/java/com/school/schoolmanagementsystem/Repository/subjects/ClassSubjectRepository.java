package com.school.schoolmanagementsystem.Repository.subjects;

import com.school.schoolmanagementsystem.Entity.classes.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Long> {

    List<ClassSubject> findByClassRoomId(Long classId);

    Optional<ClassSubject> findByClassRoomIdAndSubjectId(Long classId, Long subjectId);

    boolean existsByClassRoomIdAndSubjectId(Long classId, Long subjectId);

    boolean existsByTeacherIdAndClassRoomIdAndSubjectId(Long teacherId, Long classId, Long subjectId);
}
