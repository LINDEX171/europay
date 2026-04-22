package com.europay.account.service;

import com.europay.account.dto.AccountResponse;
import com.europay.account.dto.CreateAccountRequest;
import com.europay.account.entity.Account;
import com.europay.account.mapper.AccountMapper;
import com.europay.account.repository.AccountRepository;
import com.europay.events.AccountCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public AccountResponse createAccount(String userId, CreateAccountRequest request) {
        Account account = Account.builder()
                .userId(userId)
                .iban(generateIban())
                .type(request.type())
                .build();

        account = accountRepository.save(account);

        kafkaTemplate.send("account.created", new AccountCreatedEvent(
                account.getId(),
                account.getUserId(),
                account.getType().name(),
                account.getBalance(),
                account.getIban(),
                Instant.now()
        ));

        return accountMapper.toResponse(account);
    }

    public List<AccountResponse> getMyAccounts(String userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(accountMapper::toResponse)
                .toList();
    }

    public AccountResponse getAccount(String accountId, String userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return accountMapper.toResponse(account);
    }

    private String generateIban() {
        return "FR76" + String.format("%023d", Math.abs(UUID.randomUUID().getMostSignificantBits()));
    }
}
