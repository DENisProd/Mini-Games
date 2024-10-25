package ru.denis.IStudentGames.models.Game;

import lombok.Data;

import java.util.UUID;

@Data
public class WaitDTO {
    private UUID gameId;
    private int time;

    public WaitDTO (UUID gameId, int time) {
        this.gameId = gameId;
        this.time = time;
    }
}
