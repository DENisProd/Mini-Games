package ru.denis.IStudentGames.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.denis.IStudentGames.models.Bet.Bet;
import ru.denis.IStudentGames.models.Bet.BetResponseDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    @Query("SELECT b FROM Bet b WHERE b.id = :betId AND b.player.user.clientId = :clientId")
    Optional<Bet> findByIdAndClientId(@Param("betId") Long betId, @Param("clientId") String clientId);

    @Query("SELECT new ru.denis.IStudentGames.models.Bet.BetResponseDTO(b.id, b.player.id, b.amount, b.winAmount, b.game.endedAt) " +
            "FROM Bet b WHERE b.game.endedAt IS NOT NULL ORDER BY b.game.endedAt DESC, b.id DESC")
    List<BetResponseDTO> findLastBets(Pageable pageable);

    @Query("SELECT new ru.denis.IStudentGames.models.Bet.BetResponseDTO(b.id, b.player.id, b.amount, b.winAmount, b.game.endedAt) " +
            "FROM Bet b WHERE b.game.endedAt IS NOT NULL AND b.player.user.clientId = :clientId ORDER BY b.game.endedAt DESC, b.id DESC")
    List<BetResponseDTO> findLastBetsByClientId(@Param("clientId") String clientId, Pageable pageable);

    @Query("SELECT new ru.denis.IStudentGames.models.Bet.BetResponseDTO(b.id, b.player.id, b.amount, b.winAmount, b.game.endedAt) " +
            "FROM Bet b WHERE b.game.endedAt IS NOT NULL AND b.winAmount > 0 ORDER BY b.winAmount DESC, b.id DESC")
    List<BetResponseDTO> findTopBets(Pageable pageable);
}
