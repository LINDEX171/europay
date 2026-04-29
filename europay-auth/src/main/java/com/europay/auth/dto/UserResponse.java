package com.europay.auth.dto;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String role,
        boolean enabled,
        String createdAt
) {}
