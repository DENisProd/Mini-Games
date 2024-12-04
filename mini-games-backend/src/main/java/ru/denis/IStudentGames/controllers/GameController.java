package ru.denis.IStudentGames.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetWithdrawDTO;
import ru.denis.IStudentGames.models.Game.WaitDTO;
import ru.denis.IStudentGames.models.Games.RocketGame;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class GameController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RocketGame rocketGame;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private final AtomicInteger connectedUsers = new AtomicInteger(0);

    @MessageMapping("/start")
    public void handleUserConnect() {
        connectedUsers.incrementAndGet();
        if (connectedUsers.get() == 1) {
            startGameLoop();
        }
    }

    @MessageMapping("/withdraw")
    public void withdrawBet(@Payload BetWithdrawDTO betInfo) {
        try {
            Bet bet = rocketGame.withdraw(betInfo);
            messagingTemplate.convertAndSend("/topic/win", bet);
        } catch (IllegalStateException | EntityNotFoundException e) {
            messagingTemplate.convertAndSend("/topic/error", e.getMessage());
        }

    }

    private void startGameLoop() {
        scheduler.scheduleWithFixedDelay(() -> {
            if (connectedUsers.get() > 0) {
                try {
                    rocketGame.startGame();
                    for (int i = 20; i > 0; i--) {
                        messagingTemplate.convertAndSend("/topic/waitTime", new WaitDTO(rocketGame.getCurrentGameId(), i));
                        TimeUnit.SECONDS.sleep(1);
                    }

                    rocketGame.startMultiplierUpdate(messagingTemplate);

                    while (rocketGame.isGameRunning()) {
                        TimeUnit.MILLISECONDS.sleep(300);
                    }

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }


    @MessageMapping("/stop")
    public void handleUserDisconnect() {
        int users = connectedUsers.decrementAndGet();
        if (users <= 0) {
            connectedUsers.set(0);
        }
    }

    @MessageMapping("/getMultiplier")
    @SendTo("/topic/multiplier")
    public double getMultiplier() {
        return rocketGame.getCurrentMultiplier();
    }
}