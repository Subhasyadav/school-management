//package com.school.schoolmanagementsystem.Entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedDate;
//import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "assignment_submissions")
//@Getter @Setter
//@EntityListeners(AuditingEntityListener.class)
//public class AssignmentSubmission {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "assignment_id", nullable = false)
//    private Assignment assignment;
//
//    @ManyToOne
//    @JoinColumn(name = "student_id", nullable = false)
//    private Student student;
//
//    @Column(nullable = false)
//    private LocalDateTime submissionDate;
//
//    private String fileUrl;              // path to submitted file
//
//    private Double grade;                 // marks obtained (optional)
//
//    private String feedback;               // teacher's comments
//
//    @ManyToOne
//    @JoinColumn(name = "graded_by")
//    private Teacher gradedBy;              // teacher who graded
//
//    @CreatedDate
//    @Column(updatable = false)
//    private LocalDateTime createdAt;
//
//    @LastModifiedDate
//    private LocalDateTime updatedAt;
//}

package com.school.schoolmanagementsystem.Entity.assignment;

import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private LocalDateTime submissionDate;

    private String fileUrl;              // path to submitted file

    private boolean late = false;         // true if submitted after due date

    private int version = 1;              // submission version (for resubmissions)

    // Grading fields
    private Double grade;                 // marks obtained (optional)
    private String letterGrade;            // e.g., "A", "B+"
    private String gradeType;              // PERCENTAGE, LETTER, PASS_FAIL
    private String feedback;                // teacher's comments

    @ManyToOne
    @JoinColumn(name = "graded_by")
    private Teacher gradedBy;              // teacher who graded

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
