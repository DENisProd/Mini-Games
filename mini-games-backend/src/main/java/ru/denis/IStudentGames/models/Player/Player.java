package ru.denis.IStudentGames.models.Player;

import jakarta.persistence.*;
import lombok.Data;
import ru.denis.IStudentGames.models.User.User;

@Entity
@Data
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;
}
