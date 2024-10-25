package ru.denis.IStudentGames.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.denis.IStudentGames.models.Player.Player;
import ru.denis.IStudentGames.models.User.User;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByUser(User user);
}
