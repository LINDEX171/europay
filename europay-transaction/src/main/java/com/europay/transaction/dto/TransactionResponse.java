package com.europay.transaction.dto;

import com.europay.transaction.entity.TransactionStatus;
import com.europay.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        String id,
        String userId,
        String sourceAccountId,
        String targetAccountId,
        TransactionType type,
        BigDecimal amount,
        String description,
        TransactionStatus status,
        String failureReason,
        LocalDateTime createdAt
) {}
