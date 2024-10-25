package ru.denis.IStudentGames.services.Transaction;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.models.Transaction.Transaction;
import ru.denis.IStudentGames.models.Transaction.TransactionType;
import ru.denis.IStudentGames.repositories.AccountRepository;
import ru.denis.IStudentGames.repositories.TransactionRepository;

@RunWith(MockitoJUnitRunner.class)
public class TransactionServiceTest {

    @InjectMocks
    private TransactionService transactionService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;
    private final String clientId = "erg87e4y4yfe4yyf4";

    @Test
    public void testProcessCreditTransaction() {
        Account account = new Account();
        account.setBalance(100.00);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(50.00);
        transaction.setType(TransactionType.CREDIT);

        Mockito.when(accountRepository.save(account)).thenReturn(account);

        transactionService.processTransaction(transaction, clientId);

        Assertions.assertEquals(150.00, account.getBalance());

        Mockito.verify(accountRepository, Mockito.times(1)).save(account);
        Mockito.verify(transactionRepository, Mockito.times(1)).save(transaction);
    }

    @Test
    public void testProcessDebitTransaction() {
        Account account = new Account();
        account.setBalance(100.00);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(30.00);
        transaction.setType(TransactionType.DEBIT);

        Mockito.when(accountRepository.save(account)).thenReturn(account);

        transactionService.processTransaction(transaction, clientId);

        Assertions.assertEquals(70.00, account.getBalance());

        Mockito.verify(accountRepository, Mockito.times(1)).save(account);
        Mockito.verify(transactionRepository, Mockito.times(1)).save(transaction);
    }
}
