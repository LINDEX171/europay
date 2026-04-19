package com.europay.events;

import java.time.Instant;

public record TransactionValidatedEvent(
        String transactionId,
        boolean valid,
        String rejectionReason,
        Instant occurredAt
) {}
