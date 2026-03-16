package com.school.schoolmanagementsystem.Entity.users;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.Setter;

@Entity
@PrimaryKeyJoinColumn(name = "user_id")
@Getter @Setter
public class Admin extends User {
    // No additional fields required for now.
    // You can add admin-specific fields (e.g., department, permissions) here.
    private String department;
}