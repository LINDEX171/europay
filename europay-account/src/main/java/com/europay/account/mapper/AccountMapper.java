package com.europay.account.mapper;

import com.europay.account.dto.AccountResponse;
import com.europay.account.entity.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
    public AccountResponse toResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getUserId(),
                account.getIban(),
                account.getType(),
                account.getStatus(),
                account.getBalance(),
                account.getCreatedAt()
        );
    }
}
