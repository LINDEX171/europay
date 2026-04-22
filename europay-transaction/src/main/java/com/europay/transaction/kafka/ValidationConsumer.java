package com.europay.transaction.kafka;

import com.europay.events.TransactionFailedEvent;
import com.europay.events.TransactionInitiatedEvent;
import com.europay.events.TransactionValidatedEvent;
import com.europay.transaction.entity.Transaction;
import com.europay.transaction.entity.TransactionStatus;
import com.europay.transaction.entity.TransactionType;
import com.europay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class ValidationConsumer {

    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "transaction.initiated", groupId = "transaction-service")
    public void onTransactionInitiated(TransactionInitiatedEvent event) {
        log.info("Validating transaction: {}", event.transactionId());

        Transaction transaction = transactionRepository.findById(event.transactionId())
                .orElse(null);

        if (transaction == null) {
            log.error("Transaction not found: {}", event.transactionId());
            return;
        }

        String error = validate(transaction);

        if (error != null) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason(error);
            transactionRepository.save(transaction);

            kafkaTemplate.send("transaction.failed", new TransactionFailedEvent(
                    transaction.getId(),
                    error,
                    Instant.now()
            ));
            return;
        }

        transaction.setStatus(TransactionStatus.VALIDATED);
        transactionRepository.save(transaction);

        kafkaTemplate.send("transaction.validated", new TransactionValidatedEvent(
                transaction.getId(),
                transaction.getUserId(),
                transaction.getSourceAccountId(),
                transaction.getTargetAccountId(),
                transaction.getType().name(),
                transaction.getAmount(),
                Instant.now()
        ));
    }

    private String validate(Transaction transaction) {
        BigDecimal amount = transaction.getAmount();
        TransactionType type = transaction.getType();

        if (type == TransactionType.RETRAIT && amount.compareTo(new BigDecimal("5000")) > 0) {
            return "Retrait limité à 5000€";
        }

        if (type == TransactionType.VIREMENT && amount.compareTo(new BigDecimal("10000")) > 0) {
            return "Virement limité à 10000€";
        }

        return null;
    }
}
