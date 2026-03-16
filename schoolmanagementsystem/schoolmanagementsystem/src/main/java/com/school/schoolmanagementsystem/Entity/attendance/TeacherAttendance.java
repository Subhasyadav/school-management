package com.school.schoolmanagementsystem.Entity.attendance;

import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.Enum.LeaveType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "teacher_attendances",
        uniqueConstraints = @UniqueConstraint(columnNames = {"teacher_id", "date"}))
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public class TeacherAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;   // null means present, otherwise leave type (VACATION, SICK, etc.)

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "marked_by")
    private User markedBy; // Admin who marked it

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
