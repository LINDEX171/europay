package com.europay.auth.controller;

import com.europay.auth.dto.UserResponse;
import com.europay.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(u -> new UserResponse(
                                u.getId(),
                                u.getEmail(),
                                u.getFirstName(),
                                u.getLastName(),
                                u.getRole().name(),
                                u.isEnabled(),
                                u.getCreatedAt().toString()
                        ))
                        .toList()
        );
    }
}
