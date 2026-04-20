package com.europay.auth.dto;

public record AuthResponse(
        String token,
        String userId,
        String email,
        String role
) {}
