//package com.school.schoolmanagementsystem.Entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedDate;
//import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Table(name = "assignments")
//@Getter @Setter
//@EntityListeners(AuditingEntityListener.class)
//public class Assignment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String title;
//
//    @Column(length = 2000)
//    private String description;
//
//    @ManyToOne
//    @JoinColumn(name = "class_id", nullable = false)
//    private ClassRoom classRoom;
//
//    @ManyToOne
//    @JoinColumn(name = "subject_id", nullable = false)
//    private Subject subject;
//
//    @ManyToOne
//    @JoinColumn(name = "teacher_id", nullable = false)
//    private Teacher teacher;           // teacher who created it
//
//    private LocalDate dueDate;
//
//    private String attachmentUrl;       // path to file (if any)
//
//    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<AssignmentSubmission> submissions = new HashSet<>();
//
//    @CreatedDate
//    @Column(updatable = false)
//    private LocalDateTime createdAt;
//
//    @LastModifiedDate
//    private LocalDateTime updatedAt;
//}

package com.school.schoolmanagementsystem.Entity.assignment;

import com.school.schoolmanagementsystem.Entity.Subject;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Enum.AssignmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "assignments")
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;           // teacher who created it

    private LocalDate dueDate;

    private String attachmentUrl;       // path to file (if any)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status = AssignmentStatus.DRAFT;   // draft, published, archived

    private LocalDateTime publishDate;   // when it becomes visible to students

    private boolean allowLateSubmission = false;   // if true, submissions after due date are accepted (marked late)
    private double latePenaltyPercent = 0.0;        // e.g., 10% deduction

    private boolean anonymousGrading = false;        // hide student names during grading

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AssignmentSubmission> submissions = new HashSet<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean deleted = false;   // soft delete
}
