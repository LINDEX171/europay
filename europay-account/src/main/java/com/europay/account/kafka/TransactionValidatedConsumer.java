package com.europay.account.kafka;

import com.europay.account.entity.Account;
import com.europay.account.repository.AccountRepository;
import com.europay.events.TransactionCompletedEvent;
import com.europay.events.TransactionFailedEvent;
import com.europay.events.TransactionValidatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionValidatedConsumer {

    private final AccountRepository accountRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "transaction.validated", groupId = "account-service")
    public void onTransactionValidated(TransactionValidatedEvent event) {
        log.info("Processing validated transaction: {}", event.transactionId());

        try {
            String type = event.transactionType();

            if ("DEPOT".equals(type)) {
                handleDepot(event);
            } else if ("RETRAIT".equals(type)) {
                handleRetrait(event);
            } else if ("VIREMENT".equals(type)) {
                handleVirement(event);
            }
        } catch (Exception e) {
            log.error("Failed to process transaction {}: {}", event.transactionId(), e.getMessage());
            kafkaTemplate.send("transaction.failed", new TransactionFailedEvent(
                    event.transactionId(),
                    e.getMessage(),
                    Instant.now()
            ));
        }
    }

    private void handleDepot(TransactionValidatedEvent event) {
        Account target = accountRepository.findById(event.targetAccountId())
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        target.setBalance(target.getBalance().add(event.amount()));
        accountRepository.save(target);

        kafkaTemplate.send("transaction.completed", new TransactionCompletedEvent(
                event.transactionId(),
                null,
                target.getId(),
                event.amount(),
                target.getBalance(),
                Instant.now()
        ));
    }

    private void handleRetrait(TransactionValidatedEvent event) {
        Account source = accountRepository.findById(event.sourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        if (source.getBalance().compareTo(event.amount()) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        source.setBalance(source.getBalance().subtract(event.amount()));
        accountRepository.save(source);

        kafkaTemplate.send("transaction.completed", new TransactionCompletedEvent(
                event.transactionId(),
                source.getId(),
                null,
                event.amount(),
                source.getBalance(),
                Instant.now()
        ));
    }

    private void handleVirement(TransactionValidatedEvent event) {
        Account source = accountRepository.findById(event.sourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account target = accountRepository.findById(event.targetAccountId())
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        if (source.getBalance().compareTo(event.amount()) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        source.setBalance(source.getBalance().subtract(event.amount()));
        target.setBalance(target.getBalance().add(event.amount()));

        accountRepository.save(source);
        accountRepository.save(target);

        kafkaTemplate.send("transaction.completed", new TransactionCompletedEvent(
                event.transactionId(),
                source.getId(),
                target.getId(),
                event.amount(),
                source.getBalance(),
                Instant.now()
        ));
    }
}
