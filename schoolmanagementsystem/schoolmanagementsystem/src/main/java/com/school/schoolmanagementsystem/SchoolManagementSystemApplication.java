//package com.school.schoolmanagementsystem;
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//
//@SpringBootApplication
//public class SchoolManagementSystemApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(SchoolManagementSystemApplication.class, args);
//	}
//
//}

package com.school.schoolmanagementsystem;

import com.school.schoolmanagementsystem.Entity.users.Admin;
import com.school.schoolmanagementsystem.Enum.Role;
import com.school.schoolmanagementsystem.Repository.users.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SchoolManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolManagementSystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@school.com")) {
				Admin admin = new Admin();
				admin.setEmail("admin@school.com");
				admin.setPasswordHash(passwordEncoder.encode("admin123"));
				admin.setFirstName("System");
				admin.setLastName("Administrator");
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Default admin created.");
			}
		};
	}
}
