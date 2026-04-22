package com.europay.account.dto;

import com.europay.account.entity.AccountStatus;
import com.europay.account.entity.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        String id,
        String userId,
        String iban,
        AccountType type,
        AccountStatus status,
        BigDecimal balance,
        LocalDateTime createdAt
) {}
