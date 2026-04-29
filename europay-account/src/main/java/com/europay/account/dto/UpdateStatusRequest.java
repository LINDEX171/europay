package com.europay.account.dto;

import com.europay.account.entity.AccountStatus;

public record UpdateStatusRequest(AccountStatus status) {}
