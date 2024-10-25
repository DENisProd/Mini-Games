package ru.denis.IStudentGames.models.Account;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.denis.IStudentGames.models.Transaction.Transaction;
import ru.denis.IStudentGames.models.User.User;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double balance;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
}
