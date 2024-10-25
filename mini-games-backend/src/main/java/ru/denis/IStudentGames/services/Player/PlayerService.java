package ru.denis.IStudentGames.services.Player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.denis.IStudentGames.models.Player.Player;
import ru.denis.IStudentGames.models.User.User;
import ru.denis.IStudentGames.repositories.PlayerRepository;
import ru.denis.IStudentGames.repositories.UserRepository;

@Service
public class PlayerService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Transactional
    public Player getOrCreatePlayerByClientId(String clientId) {
        User user = userRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("User with clientId " + clientId + " not found"));

        return playerRepository.findByUser(user)
                .orElseGet(() -> {
                    Player newPlayer = new Player();
                    newPlayer.setUser(user);
                    return playerRepository.save(newPlayer);
                });
    }
}
