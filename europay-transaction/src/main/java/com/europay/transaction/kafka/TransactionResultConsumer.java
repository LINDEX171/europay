package com.europay.transaction.kafka;

import com.europay.events.TransactionCompletedEvent;
import com.europay.events.TransactionFailedEvent;
import com.europay.transaction.entity.Transaction;
import com.europay.transaction.entity.TransactionStatus;
import com.europay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionResultConsumer {

    private final TransactionRepository transactionRepository;

    @KafkaListener(topics = "transaction.completed", groupId = "transaction-service")
    public void onTransactionCompleted(TransactionCompletedEvent event) {
        log.info("Transaction completed: {}", event.transactionId());
        transactionRepository.findById(event.transactionId()).ifPresent(t -> {
            t.setStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(t);
        });
    }

    @KafkaListener(topics = "transaction.failed", groupId = "transaction-service")
    public void onTransactionFailed(TransactionFailedEvent event) {
        log.info("Transaction failed: {}", event.transactionId());
        transactionRepository.findById(event.transactionId()).ifPresent(t -> {
            t.setStatus(TransactionStatus.FAILED);
            t.setFailureReason(event.reason());
            transactionRepository.save(t);
        });
    }
}
