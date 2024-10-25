package ru.denis.IStudentGames.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetDTO;
import ru.denis.IStudentGames.models.Bet.BetResponseDTO;
import ru.denis.IStudentGames.models.Player.Player;
import ru.denis.IStudentGames.models.ResponseDTO;
import ru.denis.IStudentGames.services.Bet.BetService;
import ru.denis.IStudentGames.services.Player.PlayerService;

import java.util.List;

@RestController
@RequestMapping("/bet")
@CrossOrigin(origins = "*")
public class BetController {

    @Autowired
    private BetService betService;
    @Autowired
    private PlayerService playerService;

    @PostMapping("/")
    public ResponseEntity<?> createBet (@RequestBody BetDTO betDTO) {
        try {
            Player player = playerService.getOrCreatePlayerByClientId(betDTO.getClientId());
            var bet = betService.createBet(betDTO.getGameId(), player.getId(), betDTO.getAmount());
            return ResponseEntity
                    .ok()
                    .body(new ResponseDTO<Bet>("ok", true, bet));
        } catch (IllegalStateException | EntityNotFoundException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ResponseDTO<>(e.getMessage(), false));
        }
    }

    @GetMapping("/last")
    public ResponseEntity<?> fetchLast () {
        List<BetResponseDTO> bets = betService.fetchLastBets();
        return ResponseEntity
                .ok()
                .body(new ResponseDTO<List<BetResponseDTO>>("ok", true, bets));
    }
}
