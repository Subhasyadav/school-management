package com.school.schoolmanagementsystem.Entity.classes;

import com.school.schoolmanagementsystem.Entity.users.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "classes")
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;          // e.g., "10 A"

    private String academicYear;   // e.g., "2025"

    @ManyToOne
    @JoinColumn(name = "class_teacher_id")
    private Teacher classTeacher;  // the teacher responsible for the class

    @OneToMany(mappedBy = "classRoom")
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(mappedBy = "classRoom")
    private Set<ClassSubject> classSubjects = new HashSet<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean deleted = false;   // soft delete
}
