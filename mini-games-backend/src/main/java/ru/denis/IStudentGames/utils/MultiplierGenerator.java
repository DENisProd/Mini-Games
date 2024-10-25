package ru.denis.IStudentGames.utils;

import lombok.Getter;

import java.util.Random;

@Getter
public class MultiplierGenerator {
    private final Random random = new Random();
    private double multiplier;

    public double generateMultiplier() {
        double rand = random.nextDouble();

        if (rand < 0.6) { // 60% вероятность для диапазона [1.0, 1.5]
            multiplier = 1.1 + rand * (1.5 - 1.1);
        } else if (rand < 0.95) { // 30% вероятность для диапазона [1.5, 3]
            multiplier = 1.5 + (rand - 0.6) / 0.3 * (3.0 - 1.5);
        } else { // 10% вероятность для диапазона [3, 20]
            multiplier = 3.0 + (rand - 0.9) / 0.1 * (20.0 - 3.0);
        }

        return multiplier;
    }
}
