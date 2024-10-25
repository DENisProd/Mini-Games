package ru.denis.IStudentGames.models.Bet;

import lombok.*;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
public class BetResponseDTO extends Bet{
    private LocalDateTime endedAt;

    public BetResponseDTO(LocalDateTime endedAt, Long id, double amount, double winAmount) {
        super(id, amount, winAmount);
        this.endedAt = endedAt;
    }
}
