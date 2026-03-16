package com.school.schoolmanagementsystem.Entity.attendance;

import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.Subject;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Enum.AttendanceStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "marked_by")
    private Teacher markedBy;   // teacher who marked attendance

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
