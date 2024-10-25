package ru.denis.IStudentGames.models.Bet;

import lombok.Data;

import java.util.UUID;

@Data
public class BetDTO {
    private String clientId;
    private UUID gameId;
    private double amount;
}
