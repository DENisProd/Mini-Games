package ru.denis.IStudentGames.repository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ru.denis.IStudentGames.models.Account.Account;
import ru.denis.IStudentGames.repositories.AccountRepository;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AccountRepositoryTests {

    @Autowired
    private AccountRepository accountRepository;

    @Test
    public void AccountRepository_Save_ReturnsSavedAccount () {
        Account account = new Account();
        account.setBalance(200.00);

        Account savedAccount = accountRepository.save(account);

        Assertions.assertThat(savedAccount).isNotNull();
        Assertions.assertThat(savedAccount.getId()).isGreaterThan(0);
    }

//    @Test
//    public void AccountRepository_GetAll_ReturnMoreThenOneAccount () {
//        Account account1 = new Account();
//        account1.setBalance(350.00);
//
//        Account account2 = new Account();
//        account1.setBalance(150.00);
//
//        accountRepository.save(account1);
//        accountRepository.save(account2);
//
//        List<Account> accountList = accountRepository.findAll();
//
//        Assertions.assertThat(accountList).isNotNull();
//        Assertions.assertThat(accountList.size()).isEqualTo(2);
//    }
}
