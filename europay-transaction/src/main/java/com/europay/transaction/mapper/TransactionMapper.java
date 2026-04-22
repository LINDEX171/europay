package com.europay.transaction.mapper;

import com.europay.transaction.dto.TransactionResponse;
import com.europay.transaction.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {
    public TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getUserId(),
                transaction.getSourceAccountId(),
                transaction.getTargetAccountId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getStatus(),
                transaction.getFailureReason(),
                transaction.getCreatedAt()
        );
    }
}
