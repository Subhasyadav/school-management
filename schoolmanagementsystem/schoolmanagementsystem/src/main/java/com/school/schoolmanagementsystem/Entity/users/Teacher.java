package com.school.schoolmanagementsystem.Entity.users;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@PrimaryKeyJoinColumn(name = "user_id")
@Getter @Setter
public class Teacher extends User {

    private String qualification;
    private LocalDate hireDate;
    private String department;
}