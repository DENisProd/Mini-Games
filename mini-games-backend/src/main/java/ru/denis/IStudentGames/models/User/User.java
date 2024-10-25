package ru.denis.IStudentGames.models.User;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.denis.IStudentGames.models.Account.Account;

@Data
@Entity
@Table(	name = "users")
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clientId;
    private String serverId;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;
}
