package ru.denis.IStudentGames.services.Account;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.repositories.AccountRepository;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    public double getAccountBalanceByClientId (String clientId) {
        Account account = accountRepository.findByClientId(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + clientId));

        return account.getBalance();
    }
}
