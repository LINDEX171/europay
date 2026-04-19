package com.europay.events;

import java.time.Instant;

public record TransactionFailedEvent(
        String transactionId,
        String reason,
        Instant occurredAt
) {}
