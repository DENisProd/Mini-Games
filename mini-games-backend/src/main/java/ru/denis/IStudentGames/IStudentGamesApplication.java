package ru.denis.IStudentGames;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ru.denis.IStudentGames.config.EnvInitializer;

@SpringBootApplication
public class IStudentGamesApplication {

	public static void main(String[] args) {
		new EnvInitializer();
		SpringApplication.run(IStudentGamesApplication.class, args);
	}

}
