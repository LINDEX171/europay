package com.europay.events;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionCompletedEvent(
        String transactionId,
        String sourceAccountId,
        String targetAccountId,
        BigDecimal amount,
        BigDecimal newSourceBalance,
        Instant occurredAt
) {}
