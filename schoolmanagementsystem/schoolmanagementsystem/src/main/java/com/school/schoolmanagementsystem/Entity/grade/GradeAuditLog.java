//package com.school.schoolmanagementsystem.Entity;
//
//public class GradeAduitLog {
//}


package com.school.schoolmanagementsystem.Entity.grade;

import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "grade_audit_log")
@Getter @Setter
public class GradeAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private AssignmentSubmission submission;

    private Double oldGrade;
    private Double newGrade;
    private String oldLetterGrade;
    private String newLetterGrade;
    private String oldFeedback;
    private String newFeedback;

    @ManyToOne
    @JoinColumn(name = "changed_by", nullable = false)
    private Teacher changedBy;

    private LocalDateTime changedAt;
}