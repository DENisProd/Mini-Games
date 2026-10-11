package ru.denis.IStudentGames.models.Games;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetWithdrawDTO;
import ru.denis.IStudentGames.services.Bet.BetService;
import ru.denis.IStudentGames.services.Game.GameService;
import ru.denis.IStudentGames.utils.MultiplierGenerator;

import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class RocketGame extends Game {
    private static final double INITIAL_MULTIPLIER = 1.0;
    // Частота отправки множителя клиентам. Чем чаще, тем плавнее анимация на фронте.
    private static final long TICK_MS = 100;
    // Средний прирост множителя в секунду (как и раньше: ~0.025 за 300 мс).
    private static final double MAX_INCREMENT_PER_TICK = 0.05 * TICK_MS / 300.0;

    @Getter
    private volatile UUID currentGameId;
    @Getter
    private volatile double currentMultiplier = INITIAL_MULTIPLIER;
    private volatile boolean gameRunning = false;
    private double maxMultiplier;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private ScheduledFuture<?> multiplierTask;
    private final MultiplierGenerator generator = new MultiplierGenerator();

    @Autowired
    private GameService gameService;
    @Autowired
    private BetService betService;

    public RocketGame() {
        super("Rocket Game");
    }

    public boolean isGameRunning() {
        return gameRunning;
    }

    @Override
    public synchronized void startGame() {
        currentMultiplier = INITIAL_MULTIPLIER;
        currentGameId = gameService.createGame("").getId();
    }

    @Override
    public synchronized void endGame() {
        gameRunning = false;
        if (multiplierTask != null) {
            multiplierTask.cancel(false);
            multiplierTask = null;
        }
    }

    /**
     * Вывод ставки. Синхронизирован с тиком множителя, чтобы нельзя было
     * забрать выигрыш после краша или по множителю, которого не было.
     */
    public synchronized Bet withdraw(BetWithdrawDTO betWithdrawDTO) {
        if (!gameRunning) {
            throw new IllegalStateException("Игра не идёт, вывести ставку нельзя");
        }
        return betService.calculateWin(betWithdrawDTO.getClientId(), betWithdrawDTO.getBetId(), currentGameId, currentMultiplier);
    }

    public synchronized void startMultiplierUpdate(SimpMessagingTemplate messagingTemplate) {
        gameService.updateStarted(currentGameId);
        maxMultiplier = generator.generateMultiplier();
        gameRunning = true;

        messagingTemplate.convertAndSend("/topic/multiplier", currentMultiplier);
        multiplierTask = scheduler.scheduleAtFixedRate(() -> tick(messagingTemplate), TICK_MS, TICK_MS, TimeUnit.MILLISECONDS);
    }

    private synchronized void tick(SimpMessagingTemplate messagingTemplate) {
        if (!gameRunning) {
            return;
        }
        try {
            double next = currentMultiplier + Math.random() * MAX_INCREMENT_PER_TICK;

            if (next > maxMultiplier) {
                endGame();
                gameService.updateGame(currentGameId, currentMultiplier);
                messagingTemplate.convertAndSend("/topic/crush", currentMultiplier);
                return;
            }

            currentMultiplier = next;
            messagingTemplate.convertAndSend("/topic/multiplier", currentMultiplier);
        } catch (RuntimeException e) {
            // Исключение внутри scheduleAtFixedRate молча останавливает задачу,
            // а игровой цикл навсегда зависает в ожидании конца раунда.
            e.printStackTrace();
            endGame();
        }
    }
}
