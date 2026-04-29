package com.europay.account.repository;

import com.europay.account.entity.Account;
import com.europay.account.entity.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findByUserId(String userId);
    boolean existsByUserIdAndType(String userId, AccountType type);
}
