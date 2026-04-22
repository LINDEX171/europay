package com.europay.transaction.repository;

import com.europay.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findBySourceAccountId(String accountId);
}
