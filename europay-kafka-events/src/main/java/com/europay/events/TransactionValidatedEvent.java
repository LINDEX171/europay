package com.europay.events;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionValidatedEvent(
        String transactionId,
        String userId,
        String sourceAccountId,
        String targetAccountId,
        String transactionType,
        BigDecimal amount,
        Instant occurredAt
) {}
