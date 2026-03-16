package com.school.schoolmanagementsystem.Entity.users;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@PrimaryKeyJoinColumn(name = "user_id")
@Getter @Setter
public class Parent extends User {

    private String occupation;
}
