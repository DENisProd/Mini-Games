package ru.denis.IStudentGames.models.Transaction;

import jakarta.persistence.*;
import lombok.Data;
import ru.denis.IStudentGames.models.Account.Account;

import java.time.LocalDateTime;

@Data
@Entity
@Table(	name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    private double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private LocalDateTime createdAt = LocalDateTime.now();
}
