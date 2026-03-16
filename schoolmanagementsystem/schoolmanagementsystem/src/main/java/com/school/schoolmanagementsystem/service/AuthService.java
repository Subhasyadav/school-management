package com.school.schoolmanagementsystem.service;

//import com.school.dto.request.LoginRequest;
//import com.school.entity.User;
//import com.school.exception.InvalidCredentialsException;
//import com.school.exception.TokenRefreshException;
//import com.school.repository.UserRepository;
//import com.school.config.JwtUtils;
import com.school.schoolmanagementsystem.Config.JwtUtils;
import com.school.schoolmanagementsystem.DTOs.response.auths.LoginRequest;
import com.school.schoolmanagementsystem.Entity.users.User;
import com.school.schoolmanagementsystem.Repository.users.UserRepository;
import com.school.schoolmanagementsystem.exception.InvalidCredentialsException;
import com.school.schoolmanagementsystem.exception.TokenRefreshException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public User authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return (User) authentication.getPrincipal();
    }

    public String generateAccessToken(User user) {
        return jwtUtils.generateAccessToken(user);
    }

    public String generateRefreshToken(User user) {
        return jwtUtils.generateRefreshToken(user);
    }

    public String refreshAccessToken(String refreshToken) {
        if (!jwtUtils.validateRefreshToken(refreshToken)) {
            throw new TokenRefreshException("Invalid refresh token");
        }
        String username = jwtUtils.extractUsername(refreshToken, jwtUtils.getRefreshTokenSecret());
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new TokenRefreshException("User not found"));
        return jwtUtils.generateAccessToken(user);
    }

    public String rotateRefreshToken(String oldRefreshToken) {
        // Optional: implement token rotation (invalidate old token, generate new)
        // For simplicity, we just generate a new refresh token using same user.
        // In a more secure implementation, you might revoke the old one.
        String username = jwtUtils.extractUsername(oldRefreshToken, jwtUtils.getRefreshTokenSecret());
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new TokenRefreshException("User not found"));
        return jwtUtils.generateRefreshToken(user);
    }

    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Old password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
