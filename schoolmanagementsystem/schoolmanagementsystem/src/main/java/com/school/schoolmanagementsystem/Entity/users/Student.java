package com.school.schoolmanagementsystem.Entity.users;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@PrimaryKeyJoinColumn(name = "user_id")
@Getter @Setter
public class Student extends User {

    private LocalDate enrollmentDate;
    private LocalDate dateOfBirth;
    private String address;
}
