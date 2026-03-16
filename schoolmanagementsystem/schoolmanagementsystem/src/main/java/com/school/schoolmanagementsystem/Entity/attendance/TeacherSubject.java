//package com.school.schoolmanagementsystem.Entity.attendance;
//
//import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
//import com.school.schoolmanagementsystem.Entity.Subject;
//import com.school.schoolmanagementsystem.Entity.users.Teacher;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name = "teacher_subjects",
//        uniqueConstraints = @UniqueConstraint(columnNames = {"teacher_id", "subject_id", "class_id"}))
//@Getter @Setter
//public class TeacherSubject {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "teacher_id", nullable = false)
//    private Teacher teacher;
//
//    @ManyToOne
//    @JoinColumn(name = "subject_id", nullable = false)
//    private Subject subject;
//
//    @ManyToOne
//    @JoinColumn(name = "class_id", nullable = false)
//    private ClassRoom classRoom;
//}