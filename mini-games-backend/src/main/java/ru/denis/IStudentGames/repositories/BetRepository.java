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

    @Query("SELECT new ru.denis.IStudentGames.models.Bet.BetResponseDTO(b.game.endedAt, b.id, b.amount, b.winAmount) FROM Bet b WHERE b.game.endedAt IS NOT NULL ORDER BY b.game.endedAt DESC")
    List<BetResponseDTO> findLastBets(Pageable pageable);
}
