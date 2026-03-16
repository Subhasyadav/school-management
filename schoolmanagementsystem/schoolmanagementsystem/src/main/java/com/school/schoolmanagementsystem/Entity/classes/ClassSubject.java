package com.school.schoolmanagementsystem.Entity.classes;

import com.school.schoolmanagementsystem.Entity.Subject;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "class_subjects")
@Getter @Setter
public class ClassSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;    // teacher who teaches this subject in this class
}
