package ru.denis.IStudentGames.utils;

import java.util.Random;

public class MultiplierGenerator {
    private final Random random = new Random();

    public double generateMultiplier() {
        double rand = random.nextDouble();

        if (rand < 0.6) { // 60% вероятность для диапазона [1.1, 1.5)
            return 1.1 + rand / 0.6 * (1.5 - 1.1);
        } else if (rand < 0.95) { // 35% вероятность для диапазона [1.5, 3)
            return 1.5 + (rand - 0.6) / 0.35 * (3.0 - 1.5);
        } else { // 5% вероятность для диапазона [3, 20)
            return 3.0 + (rand - 0.95) / 0.05 * (20.0 - 3.0);
        }
    }
}
