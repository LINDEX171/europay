package com.europay.transaction.controller;

import com.europay.transaction.dto.TransactionResponse;
import com.europay.transaction.mapper.TransactionMapper;
import com.europay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions/admin")
@RequiredArgsConstructor
public class AdminTransactionController {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    @GetMapping("/all")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(
                transactionRepository.findAll().stream()
                        .map(transactionMapper::toResponse)
                        .toList()
        );
    }
}
