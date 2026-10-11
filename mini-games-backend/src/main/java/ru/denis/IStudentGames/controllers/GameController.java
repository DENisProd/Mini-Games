package ru.denis.IStudentGames.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetWithdrawDTO;
import ru.denis.IStudentGames.models.Game.WaitDTO;
import ru.denis.IStudentGames.models.Games.RocketGame;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class GameController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RocketGame rocketGame;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private final AtomicInteger connectedUsers = new AtomicInteger(0);
    private final AtomicBoolean loopStarted = new AtomicBoolean(false);

    @EventListener
    public void onSessionConnected(SessionConnectedEvent event) {
        connectedUsers.incrementAndGet();
    }

    @EventListener
    public void onSessionDisconnect(SessionDisconnectEvent event) {
        connectedUsers.updateAndGet(users -> Math.max(0, users - 1));
    }

    @MessageMapping("/start")
    public void handleUserConnect() {
        // Игровой цикл должен быть ровно один, сколько бы клиентов ни подключалось/переподключалось
        if (loopStarted.compareAndSet(false, true)) {
            startGameLoop();
        }
    }

    @MessageMapping("/withdraw")
    @SendToUser(destinations = "/queue/win", broadcast = false)
    public Bet withdrawBet(@Payload BetWithdrawDTO betInfo) {
        return rocketGame.withdraw(betInfo);
    }

    @MessageExceptionHandler({IllegalStateException.class, EntityNotFoundException.class})
    @SendToUser(destinations = "/queue/errors", broadcast = false)
    public String handleWithdrawError(RuntimeException e) {
        return e.getMessage();
    }

    private void startGameLoop() {
        scheduler.scheduleWithFixedDelay(() -> {
            if (connectedUsers.get() <= 0) {
                return;
            }
            try {
                rocketGame.startGame();
                for (int i = 20; i > 0; i--) {
                    messagingTemplate.convertAndSend("/topic/waitTime", new WaitDTO(rocketGame.getCurrentGameId(), i));
                    TimeUnit.SECONDS.sleep(1);
                }

                rocketGame.startMultiplierUpdate(messagingTemplate);

                while (rocketGame.isGameRunning()) {
                    TimeUnit.MILLISECONDS.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (RuntimeException e) {
                // Любое исключение в scheduleWithFixedDelay навсегда останавливает цикл
                e.printStackTrace();
                rocketGame.endGame();
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    @MessageMapping("/getMultiplier")
    @SendTo("/topic/multiplier")
    public double getMultiplier() {
        return rocketGame.getCurrentMultiplier();
    }
}
