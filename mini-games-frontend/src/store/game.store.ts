import { create } from "zustand";
import betService from "../service/bet.service";
import gameService from "../service/game.service";

export interface Game {
    id: string;
    result: string;
    started: boolean;
    createdAt: Date;
    endedAt: Date | null;
}

export interface Bet {
    id: number;
    amount: number;
    gameId: string;
    winAmount: number;
    endedAt?: Date | null;
}

interface GameState {
    gameId: string;
    lastGames: Game[];
    lastBets: Bet[];
    currentBet: Bet | null;

    setGameId(gameId: string): void;
    createBet(gameId: string, clientId: string, amount: number): void;
    withdrawBet(gameId: string, clientId: string, betId: number): void;
    getLastGames(): void;
    getLastBets(): void;
    resetCurrentBet(): void;
}

export const useGameStore = create<GameState>((set, get) => ({
    gameId: "",
    lastGames: [],
    lastBets: [],
    currentBet: null,

    setGameId: (gameId: string) => {
        set({ gameId });
    },
    createBet: (gameId: string, clientId: string, amount: number) => {
        betService.createBet(amount, clientId, gameId).then((result) => {
            console.log("Сделана ставка", result);
            set({ currentBet: result as unknown as Bet})
        });
    },
    getLastGames: () => {
        gameService.getLastGames().then(games => {
            set({ lastGames: games.sort((a, b) => a.endedAt - b.endedAt) });
        });
    },
    getLastBets: () => {
        betService.getLastBets().then(bets => set({ lastBets: bets.sort((a, b) => a.endedAt - b.endedAt) }));
    },
    withdrawBet: (gameId: string, clientId: string, betId: number) => {
        console.log("вывожу выигрыш");
        // betService.withdrawBet(betId, clientId, gameId).then((result) => console.log(result));
    },
    resetCurrentBet: () => {
        set({ currentBet: null });
    },
}));