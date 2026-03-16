//package com.school.schoolmanagementsystem.Repository;
//
//public interface GradeAuditLogRepository {
//}


package com.school.schoolmanagementsystem.Repository.grades;

import com.school.schoolmanagementsystem.Entity.grade.GradeAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeAuditLogRepository extends JpaRepository<GradeAuditLog, Long> {
    List<GradeAuditLog> findBySubmissionId(Long submissionId);
}