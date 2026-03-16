//package com.school.schoolmanagementsystem.Entity;

//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Table(name = "subjects")
//@Getter @Setter
//public class Subject {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, unique = true)
//    private String name;        // e.g., "Mathematics"
//
//    private String code;        // e.g., "MATH101"
//
//    @OneToMany(mappedBy = "subject")
//    private Set<ClassSubject> classSubjects = new HashSet<>();
//}


package com.school.schoolmanagementsystem.Entity;

import com.school.schoolmanagementsystem.Entity.classes.ClassSubject;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
@Getter @Setter
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String code;

    @OneToMany(mappedBy = "subject")
    private Set<ClassSubject> classSubjects = new HashSet<>();

    private boolean deleted = false;   // for soft delete
}