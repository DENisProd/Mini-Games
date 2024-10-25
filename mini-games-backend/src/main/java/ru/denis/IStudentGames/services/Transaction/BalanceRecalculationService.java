package ru.denis.IStudentGames.services.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.repositories.AccountRepository;
import ru.denis.IStudentGames.repositories.TransactionRepository;

import java.util.List;

@Service
public class BalanceRecalculationService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;

    public void recalculateBalances() {
        List<Account> accounts = accountRepository.findAll();

        for (Account account : accounts) {
            double balance = transactionRepository.getBalanceByAccountId(account.getId());
            account.setBalance(balance);
            accountRepository.save(account);
        }
    }
}
