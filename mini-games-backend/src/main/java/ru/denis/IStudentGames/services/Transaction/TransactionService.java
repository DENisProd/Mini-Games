package ru.denis.IStudentGames.services.Transaction;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.models.Transaction.Transaction;
import ru.denis.IStudentGames.models.Transaction.TransactionType;
import ru.denis.IStudentGames.repositories.AccountRepository;
import ru.denis.IStudentGames.repositories.TransactionRepository;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void processTransaction(Transaction transaction, String clientId) {
        Account account = accountRepository.findByClientId(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + clientId));

        transaction.setAccount(account);
        if (transaction.getType().equals(TransactionType.CREDIT)) {
            account.setBalance(account.getBalance() + transaction.getAmount());
        } else if (transaction.getType().equals(TransactionType.DEBIT)) {
            if ((account.getBalance() - transaction.getAmount()) < 0) {
                throw new IllegalStateException("Not enough money");
            }
            account.setBalance(account.getBalance() - transaction.getAmount());
        }

        accountRepository.save(account);
        transactionRepository.save(transaction);
    }
}
