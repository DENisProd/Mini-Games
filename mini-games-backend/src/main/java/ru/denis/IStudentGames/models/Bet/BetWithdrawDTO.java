package ru.denis.IStudentGames.models.Bet;

import lombok.Data;

@Data
public class BetWithdrawDTO {
    private String clientId;
    private String gameId;
    private Long betId;
}
