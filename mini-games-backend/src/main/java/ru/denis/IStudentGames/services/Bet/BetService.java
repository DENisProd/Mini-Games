package ru.denis.IStudentGames.services.Bet;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetResponseDTO;
import ru.denis.IStudentGames.models.Game.GameEntity;
import ru.denis.IStudentGames.models.Player.Player;
import ru.denis.IStudentGames.models.Transaction.Transaction;
import ru.denis.IStudentGames.models.Transaction.TransactionType;
import ru.denis.IStudentGames.repositories.BetRepository;
import ru.denis.IStudentGames.repositories.GameRepository;
import ru.denis.IStudentGames.repositories.PlayerRepository;
import ru.denis.IStudentGames.services.Transaction.TransactionService;

import java.util.List;
import java.util.UUID;

@Service
public class BetService {

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PlayerRepository playerRepository;

    @Transactional
    public Bet createBet (UUID gameId, Long playerId, double amount) {
        GameEntity game = gameRepository.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("Game not found with id: " + gameId));
        if (game.getStarted()) {
            throw new IllegalStateException("Cannot place a bet: the game has already started.");
        }
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + playerId));

        Bet bet = new Bet();
        bet.setPlayer(player);
        bet.setGame(game);
        bet.setAmount(amount);

        betRepository.save(bet);

        var transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(TransactionType.DEBIT);
        transactionService.processTransaction(transaction, player.getUser().getClientId());

        return bet;
    }

    @Transactional
    public Bet calculateWin (String clientId, Long betId, UUID gameId, double multiplier) {
        Bet bet = betRepository.findByIdAndClientId(betId, clientId)
                .orElseThrow(() -> new EntityNotFoundException("Bet not found with id: " + clientId));
        if (bet.getWinAmount() > 0) {
            throw new IllegalStateException("Cannot withdraw a bet: the bet has already withdraw.");
        }
        var winAmount = bet.getAmount() * multiplier;
        bet.setWinAmount(winAmount);
        betRepository.save(bet);

        var transaction = new Transaction();
        transaction.setAmount(winAmount);
        transaction.setType(TransactionType.CREDIT);
        transactionService.processTransaction(transaction, clientId);

        return bet;
    }

    public List<BetResponseDTO> fetchLastBets () {
        return betRepository.findLastBets(PageRequest.of(0, 20));
    }
}
