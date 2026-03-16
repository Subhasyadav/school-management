package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.response.users.ParentResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.StudentResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.TeacherResponse;
import com.school.schoolmanagementsystem.DTOs.response.users.UserResponse;
import com.school.schoolmanagementsystem.DTOs.request.ProfileUpdateRequest;
import com.school.schoolmanagementsystem.DTOs.request.users.UserCreateRequest;
import com.school.schoolmanagementsystem.DTOs.request.users.UserUpdateRequest;
import com.school.schoolmanagementsystem.Entity.users.*;
import com.school.schoolmanagementsystem.Enum.Role;
import com.school.schoolmanagementsystem.Repository.users.*;
import com.school.schoolmanagementsystem.exception.DuplicateResourceException;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findByDeletedFalse(pageable)
                .map(this::mapToUserResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        User user = buildUserFromRequest(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update common fields if present
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        // Role-specific updates
        if (user instanceof Teacher && request.getQualification() != null) {
            ((Teacher) user).setQualification(request.getQualification());
        }
        if (user instanceof Teacher && request.getHireDate() != null) {
            ((Teacher) user).setHireDate(request.getHireDate());
        }
        if (user instanceof Student) {
            Student student = (Student) user;
            if (request.getEnrollmentDate() != null) student.setEnrollmentDate(request.getEnrollmentDate());
            if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
            if (request.getAddress() != null) student.setAddress(request.getAddress());
        }
        if (user instanceof Parent && request.getOccupation() != null) {
            ((Parent) user).setOccupation(request.getOccupation());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.softDeleteById(id);
    }

    @Override
    public Page<UserResponse> getUsersByRole(Role role, Pageable pageable) {
        return userRepository.findByRoleAndDeletedFalse(role, pageable)
                .map(this::mapToUserResponse);
    }

    @Override
    public void assignParentToStudent(Long studentId, Long parentId) {
        Student student = studentRepository.findActiveById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Parent parent = parentRepository.findActiveById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + parentId));

        // Check if already assigned
        if (parentStudentRepository.existsByParentIdAndStudentId(parentId, studentId)) {
            throw new DuplicateResourceException("Parent already assigned to this student");
        }

        ParentStudent ps = new ParentStudent();
        ps.setParent(parent);
        ps.setStudent(student);
        parentStudentRepository.save(ps);
    }

    // ---------- Mapping Helpers ----------

    private UserResponse mapToUserResponse(User user) {
        if (user instanceof Teacher) {
            Teacher t = (Teacher) user;
            return TeacherResponse.builder()
                    .id(t.getId())
                    .email(t.getEmail())
                    .firstName(t.getFirstName())
                    .lastName(t.getLastName())
                    .phone(t.getPhone())
                    .role(t.getRole())
                    .createdAt(t.getCreatedAt())
                    .updatedAt(t.getUpdatedAt())
                    .qualification(t.getQualification())
                    .hireDate(t.getHireDate())
                    .build();
        } else if (user instanceof Student) {
            Student s = (Student) user;
            return StudentResponse.builder()
                    .id(s.getId())
                    .email(s.getEmail())
                    .firstName(s.getFirstName())
                    .lastName(s.getLastName())
                    .phone(s.getPhone())
                    .role(s.getRole())
                    .createdAt(s.getCreatedAt())
                    .updatedAt(s.getUpdatedAt())
                    .enrollmentDate(s.getEnrollmentDate())
                    .dateOfBirth(s.getDateOfBirth())
                    .address(s.getAddress())
                    .build();
        } else if (user instanceof Parent) {
            Parent p = (Parent) user;
            return ParentResponse.builder()
                    .id(p.getId())
                    .email(p.getEmail())
                    .firstName(p.getFirstName())
                    .lastName(p.getLastName())
                    .phone(p.getPhone())
                    .role(p.getRole())
                    .createdAt(p.getCreatedAt())
                    .updatedAt(p.getUpdatedAt())
                    .occupation(p.getOccupation())
                    .build();
        } else {
            // Fallback for ADMIN (which may be plain User)
            return UserResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();
        }
    }

    private User buildUserFromRequest(UserCreateRequest request) {
        switch (request.getRole()) {
            case TEACHER:
                Teacher teacher = new Teacher();
                teacher.setQualification(request.getQualification());
                teacher.setHireDate(request.getHireDate());
                setCommonFields(teacher, request);
                return teacher;
            case STUDENT:
                Student student = new Student();
                student.setEnrollmentDate(request.getEnrollmentDate());
                student.setDateOfBirth(request.getDateOfBirth());
                student.setAddress(request.getAddress());
                setCommonFields(student, request);
                return student;
            case PARENT:
                Parent parent = new Parent();
                parent.setOccupation(request.getOccupation());
                setCommonFields(parent, request);
                return parent;
            case ADMIN:
                User admin = new Admin(); // You may need an Admin entity if you want separate fields, or just use User
                setCommonFields(admin, request);
                return admin;
            default:
                throw new IllegalArgumentException("Invalid role");
        }
    }

    private void setCommonFields(User user, UserCreateRequest request) {
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        // password set later
    }

    @Override
    public UserResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findActiveById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    public Page<UserResponse> getChildrenOfParent(Long parentId, Pageable pageable) {
        // Verify parent exists
        if (!parentRepository.existsById(parentId)) {
            throw new ResourceNotFoundException("Parent not found with id: " + parentId);
        }

        // Get student IDs from the join table
        List<Long> studentIds = parentStudentRepository.findStudentIdsByParentId(parentId);

        if (studentIds.isEmpty()) {
            return Page.empty(pageable); // empty page
        }

        // Fetch students by IDs
        Page<Student> studentsPage = studentRepository.findByIdIn(studentIds, pageable);
        return studentsPage.map(this::mapToUserResponse);
    }
}
