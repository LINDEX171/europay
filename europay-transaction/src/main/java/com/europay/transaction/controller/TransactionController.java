package com.europay.transaction.controller;

import com.europay.transaction.dto.CreateTransactionRequest;
import com.europay.transaction.dto.TransactionResponse;
import com.europay.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(transactionService.getMyTransactions(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable String id,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(transactionService.getTransaction(id, userId));
    }
}
