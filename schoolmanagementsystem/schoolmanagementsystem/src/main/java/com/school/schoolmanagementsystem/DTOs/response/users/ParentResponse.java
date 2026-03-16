package com.school.schoolmanagementsystem.DTOs.response.users;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter @Setter
@SuperBuilder
public class ParentResponse extends UserResponse {
    private String occupation;
}
