package ru.denis.IStudentGames.models.Games;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetWithdrawDTO;
import ru.denis.IStudentGames.services.Bet.BetService;
import ru.denis.IStudentGames.services.Game.GameService;
import ru.denis.IStudentGames.utils.MultiplierGenerator;

import java.util.Timer;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@EqualsAndHashCode(callSuper = true)
@Data
@Component
public class RocketGame extends Game{
    private final int MIN_BET_AMOUNT = 100;
    private final double INITIAL_MULTIPLIER = 0.0;

    private UUID currentGameId;
    private double currentMultiplier;
    private double maxMultiplier;
    private Timer timer;
    private boolean isGameRunning;

    private ScheduledExecutorService scheduler;

    @Autowired
    private GameService gameService;
    @Autowired
    private BetService betService;

    public RocketGame() {
        super("Rocket Game");
        currentMultiplier = INITIAL_MULTIPLIER;
        isGameRunning = false;
        System.out.println("Init Game");
    }

    @Override
    public void startGame() {
        currentMultiplier = 1.0;
        System.out.println("Rocket Game started");
        currentGameId = gameService.createGame("").getId();
    }

    @Override
    public void endGame() {
        isGameRunning = false;
        System.out.println("Rocket Game ended");
        stopMultiplierUpdate();
    }

    public Bet withdraw(BetWithdrawDTO betWithdrawDTO) {
        return betService.calculateWin(betWithdrawDTO.getClientId(), betWithdrawDTO.getBetId(), currentGameId, currentMultiplier);
    }

    public void startMultiplierUpdate(SimpMessagingTemplate messagingTemplate) {
        this.isGameRunning = true;
        gameService.updateStarted(currentGameId);

        MultiplierGenerator generator = new MultiplierGenerator();
        maxMultiplier = generator.generateMultiplier();
        System.out.println("Maximum multiplier is set to: " + maxMultiplier);

        scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            if (!isGameRunning) {
                scheduler.shutdown();
                return;
            }

            double value = Math.random() * 0.05;

            if ((currentMultiplier + value) > maxMultiplier) {
                isGameRunning = false;

                messagingTemplate.convertAndSend("/topic/crush", currentMultiplier);

                gameService.updateGame(currentGameId, currentMultiplier);
                endGame();
                scheduler.shutdown();
                return;
            }

            updateMultiplier(value);
            messagingTemplate.convertAndSend("/topic/multiplier", currentMultiplier);
        }, 0, 300, TimeUnit.MILLISECONDS);
    }

    public void stopMultiplierUpdate() {
        if (timer != null) {
            timer.cancel();
        }
    }

    public void updateMultiplier(double increment) {
        currentMultiplier += increment;
    }
}
