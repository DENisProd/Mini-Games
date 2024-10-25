package ru.denis.IStudentGames.services.Game;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.denis.IStudentGames.models.Game.GameEntity;
import ru.denis.IStudentGames.repositories.GameRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public GameEntity createGame (String gameResult) {
        GameEntity game = new GameEntity();
        game.setResult(gameResult);
        gameRepository.save(game);
        return game;
    }

    public void updateGame (UUID id, Double gameResult) {
        var gameOptional = gameRepository.findById(id);

        if (gameOptional.isPresent()) {
            GameEntity game = gameOptional.get();

            String formattedMultiplier = String.format("%.2f", gameResult) + "x";

            game.setResult(formattedMultiplier);
            game.setEndedAt(LocalDateTime.now());
            gameRepository.save(game);
        } else {
            throw new EntityNotFoundException("Game with id " + id + " not found.");
        }
    }

    public void updateStarted (UUID id) {
        var gameOptional = gameRepository.findById(id);

        if (gameOptional.isPresent()) {
            GameEntity game = gameOptional.get();
            game.setStarted(true);

            gameRepository.save(game);
        } else {
            throw new EntityNotFoundException("Game with id " + id + " not found.");
        }
    }

    public List<GameEntity> getLast20CompletedGames() {
        return gameRepository.findTop20ByEndedAtIsNotNullOrderByEndedAtDesc();
    }
}
