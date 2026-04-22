package com.europay.transaction.dto;

import com.europay.transaction.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreateTransactionRequest(
        String sourceAccountId,
        String targetAccountId,
        @NotNull TransactionType type,
        @NotNull @Positive BigDecimal amount,
        String description
) {}
