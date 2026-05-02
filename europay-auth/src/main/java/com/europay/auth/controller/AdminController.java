package com.europay.auth.controller;

import com.europay.auth.dto.UpdateUserRequest;
import com.europay.auth.dto.UserResponse;
import com.europay.auth.entity.Role;
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
                        .map(this::toResponse)
                        .toList()
        );
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @RequestBody UpdateUserRequest request) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.role() != null) user.setRole(Role.valueOf(request.role()));
        if (request.enabled() != null) user.setEnabled(request.enabled());
        return ResponseEntity.ok(toResponse(userRepository.save(user)));
    }

    private UserResponse toResponse(com.europay.auth.entity.User u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getFirstName(),
                u.getLastName(), u.getRole().name(), u.isEnabled(), u.getCreatedAt().toString());
    }
}
