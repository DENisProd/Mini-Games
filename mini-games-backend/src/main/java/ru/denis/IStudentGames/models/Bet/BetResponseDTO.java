package ru.denis.IStudentGames.models.Bet;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BetResponseDTO {
    private Long id;
    private Long playerId;
    private double amount;
    private double winAmount;
    private LocalDateTime endedAt;
}
