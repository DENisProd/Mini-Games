package ru.denis.IStudentGames.models.Bet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.denis.IStudentGames.models.Game.GameEntity;
import ru.denis.IStudentGames.models.Player.Player;

@Entity
@Data
@NoArgsConstructor
public class Bet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private double winAmount = 0.0;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Player player;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private GameEntity game;

    public Bet(Long id, double amount, double winAmount) {
        this.id = id;
        this.amount = amount;
        this.winAmount = winAmount;
    }
}
