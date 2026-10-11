export type GamePhase = "waiting" | "flying" | "crashed";

/**
 * Изменяемое состояние раунда, которое читает сцена на каждом кадре.
 * Хранится в ref, чтобы сообщения сокета не вызывали перерендер React.
 */
export interface SceneState {
    phase: GamePhase;
    phaseStartedAt: number;
    multiplier: number;
    waitTime: number;
}

export const createSceneState = (): SceneState => ({
    phase: "waiting",
    phaseStartedAt: performance.now(),
    multiplier: 1,
    waitTime: 0,
});
