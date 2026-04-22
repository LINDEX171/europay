package com.europay.transaction.service;

import com.europay.events.TransactionInitiatedEvent;
import com.europay.transaction.dto.CreateTransactionRequest;
import com.europay.transaction.dto.TransactionResponse;
import com.europay.transaction.entity.Transaction;
import com.europay.transaction.mapper.TransactionMapper;
import com.europay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public TransactionResponse createTransaction(String userId, CreateTransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .sourceAccountId(request.sourceAccountId())
                .targetAccountId(request.targetAccountId())
                .type(request.type())
                .amount(request.amount())
                .description(request.description())
                .build();

        transaction = transactionRepository.save(transaction);

        kafkaTemplate.send("transaction.initiated", new TransactionInitiatedEvent(
                transaction.getId(),
                transaction.getSourceAccountId(),
                transaction.getTargetAccountId(),
                transaction.getAmount(),
                "EUR",
                transaction.getType().name(),
                transaction.getUserId(),
                Instant.now()
        ));

        return transactionMapper.toResponse(transaction);
    }

    public List<TransactionResponse> getMyTransactions(String userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    public TransactionResponse getTransaction(String transactionId, String userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return transactionMapper.toResponse(transaction);
    }
}
