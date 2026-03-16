package com.school.schoolmanagementsystem.service;

//import com.school.dto.request.UserCreateRequest;
//import com.school.dto.request.UserUpdateRequest;
//import com.school.dto.response.UserResponse;
//import com.school.entity.Role;
import com.school.schoolmanagementsystem.DTOs.response.users.UserResponse;
import com.school.schoolmanagementsystem.DTOs.request.ProfileUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.users.UserCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.users.UserUpdateRequest;
import com.school.schoolmanagementsystem.Enum.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserResponse> getAllUsers(Pageable pageable);

    UserResponse getUserById(Long id);

    UserResponse createUser(UserCreateRequest request);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);

    Page<UserResponse> getUsersByRole(Role role, Pageable pageable);

    void assignParentToStudent(Long studentId, Long parentId);

    UserResponse updateProfile(Long userId, ProfileUpdateRequest request);

    Page<UserResponse> getChildrenOfParent(Long parentId, Pageable pageable);
}
