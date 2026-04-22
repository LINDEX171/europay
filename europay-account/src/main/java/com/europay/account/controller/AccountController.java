package com.europay.account.controller;

import com.europay.account.dto.AccountResponse;
import com.europay.account.dto.CreateAccountRequest;
import com.europay.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accountService.createAccount(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccounts(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.getMyAccounts(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(
            @PathVariable String id,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.getAccount(id, userId));
    }
}
