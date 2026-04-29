package com.europay.account.controller;

import com.europay.account.dto.AccountResponse;
import com.europay.account.dto.UpdateStatusRequest;
import com.europay.account.mapper.AccountMapper;
import com.europay.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/admin")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @GetMapping("/all")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(
                accountRepository.findAll().stream()
                        .map(accountMapper::toResponse)
                        .toList()
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AccountResponse> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(request.status());
        return ResponseEntity.ok(accountMapper.toResponse(accountRepository.save(account)));
    }
}
