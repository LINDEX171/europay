package com.europay.audit.kafka;

import com.europay.audit.document.AuditLog;
import com.europay.audit.repository.AuditLogRepository;
import com.europay.events.AccountCreatedEvent;
import com.europay.events.TransactionCompletedEvent;
import com.europay.events.TransactionFailedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditConsumer {

    private final AuditLogRepository auditLogRepository;

    @KafkaListener(topics = "account.created", groupId = "audit-service")
    public void onAccountCreated(AccountCreatedEvent event) {
        log.info("Audit: account created {}", event.accountId());
        auditLogRepository.save(AuditLog.builder()
                .eventType("ACCOUNT_CREATED")
                .entityId(event.accountId())
                .userId(event.userId())
                .details("Type: " + event.accountType() + " | IBAN: " + event.iban())
                .occurredAt(event.occurredAt())
                .build());
    }

    @KafkaListener(topics = "transaction.completed", groupId = "audit-service")
    public void onTransactionCompleted(TransactionCompletedEvent event) {
        log.info("Audit: transaction completed {}", event.transactionId());
        auditLogRepository.save(AuditLog.builder()
                .eventType("TRANSACTION_COMPLETED")
                .entityId(event.transactionId())
                .sourceAccountId(event.sourceAccountId())
                .targetAccountId(event.targetAccountId())
                .amount(event.amount())
                .status("COMPLETED")
                .occurredAt(event.occurredAt())
                .build());
    }

    @KafkaListener(topics = "transaction.failed", groupId = "audit-service")
    public void onTransactionFailed(TransactionFailedEvent event) {
        log.info("Audit: transaction failed {}", event.transactionId());
        auditLogRepository.save(AuditLog.builder()
                .eventType("TRANSACTION_FAILED")
                .entityId(event.transactionId())
                .status("FAILED")
                .details(event.reason())
                .occurredAt(event.occurredAt())
                .build());
    }
}
