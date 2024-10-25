package ru.denis.IStudentGames.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.denis.IStudentGames.models.Game.GameEntity;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<GameEntity, UUID> {
    List<GameEntity> findTop20ByEndedAtIsNotNullOrderByEndedAtDesc();
}
