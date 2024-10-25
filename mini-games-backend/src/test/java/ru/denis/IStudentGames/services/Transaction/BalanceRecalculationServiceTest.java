package ru.denis.IStudentGames.services.Transaction;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.repositories.AccountRepository;
import ru.denis.IStudentGames.repositories.TransactionRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class BalanceRecalculationServiceTest {
    @InjectMocks
    private BalanceRecalculationService balanceRecalculationService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Test
    public void recalculateBalances() {
        Account account = new Account();
        account.setId(1L);
        account.setBalance(0.0);

        List<Account> accounts = List.of(account);

        when(accountRepository.findAll()).thenReturn(accounts);

        when(transactionRepository.getBalanceByAccountId(account.getId()))
                .thenReturn(200.00);

        balanceRecalculationService.recalculateBalances();

        assertEquals(200.00, account.getBalance());

        verify(accountRepository, times(1)).save(account);
    }
}
