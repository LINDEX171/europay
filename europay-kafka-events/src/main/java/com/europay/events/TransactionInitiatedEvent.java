package com.europay.events;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionInitiatedEvent(
        String transactionId,
        String sourceAccountId,
        String targetAccountId,
        BigDecimal amount,
        String currency,
        String transactionType,
        String initiatedBy,
        Instant occurredAt
) {}
