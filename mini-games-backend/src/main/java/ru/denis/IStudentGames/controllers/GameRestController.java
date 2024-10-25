package ru.denis.IStudentGames.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.denis.IStudentGames.models.Game.GameEntity;
import ru.denis.IStudentGames.services.Game.GameService;

import java.util.List;

@RestController
@RequestMapping("/game")
@CrossOrigin(origins = "*")
//@CrossOrigin(origins = "http://192.168.0.150:5173/")
public class GameRestController {
    @Autowired
    private GameService gameService;

    @GetMapping("/")
    public List<GameEntity> getLastGames () {
        return gameService.getLast20CompletedGames();
    }
}
