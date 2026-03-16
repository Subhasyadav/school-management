//package com.school.schoolmanagementsystem.Repository;
//
//import com.school.schoolmanagementsystem.Entity.users.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//    Optional<User> findByEmail(String email);
//    boolean existsByEmail(String email);
//}

package com.school.schoolmanagementsystem.Repository.users;

//import com.school.entity.User;
//import com.school.entity.Role;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.Enum.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Paginated list of users by role (excluding soft deleted)
    Page<User> findByRoleAndDeletedFalse(Role role, Pageable pageable);

    // Paginated list of all non-deleted users
    Page<User> findByDeletedFalse(Pageable pageable);

    // Find by ID excluding soft deleted
    @Query("SELECT u FROM User u WHERE u.id = :id AND u.deleted = false")
    Optional<User> findActiveById(@Param("id") Long id);

    // Soft delete
    @Modifying
    @Query("UPDATE User u SET u.deleted = true WHERE u.id = :id")
    void softDeleteById(@Param("id") Long id);

    long countByRoleAndDeletedFalse(Role role);
}
