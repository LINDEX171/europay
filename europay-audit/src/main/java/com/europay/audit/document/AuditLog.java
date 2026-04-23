package com.europay.audit.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    private String id;

    private String eventType;

    private String entityId;

    private String userId;

    private String sourceAccountId;

    private String targetAccountId;

    private BigDecimal amount;

    private String status;

    private String details;

    private Instant occurredAt;
}
