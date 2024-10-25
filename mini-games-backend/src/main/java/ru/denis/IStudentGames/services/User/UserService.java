package ru.denis.IStudentGames.services.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.denis.IStudentGames.repositories.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    
}
