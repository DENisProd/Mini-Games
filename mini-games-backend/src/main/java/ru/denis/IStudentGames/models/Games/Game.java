package ru.denis.IStudentGames.models.Games;

import lombok.Data;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Player.Player;

import java.util.ArrayList;
import java.util.List;

@Data
public abstract class Game {
    protected String gameName;
    protected List<Player> players;

    public Game () {
        gameName = "Default game";
        players = new ArrayList<>();
    }

    public Game(String gameName) {
        this.gameName = gameName;
        players = new ArrayList<>();
    }

    public abstract void startGame();
    public abstract void endGame();
}
