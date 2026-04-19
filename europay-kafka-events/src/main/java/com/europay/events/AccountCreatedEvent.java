package com.europay.events;

import java.math.BigDecimal;
import java.time.Instant;

public record AccountCreatedEvent(
        String accountId,
        String userId,
        String accountType,
        BigDecimal initialBalance,
        String iban,
        Instant occurredAt
) {}
