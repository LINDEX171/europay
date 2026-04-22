package com.europay.account.dto;

import com.europay.account.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(
        @NotNull AccountType type
) {}
