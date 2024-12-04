package ru.denis.IStudentGames;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IStudentGamesApplicationTests {

	@BeforeAll
	static void setupEnv() {
		Dotenv dotenv = Dotenv.configure()
				.filename(".env") // Путь к тестовому .env файлу
				.load();

		// Загружаем переменные в системное окружение
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);
	}

	@Test
	void contextLoads() {
	}

}
