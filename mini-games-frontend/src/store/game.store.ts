import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import betService from "../service/bet.service";
import gameService from "../service/game.service";
import { useUserStore } from "./user.store";

export interface Game {
    id: string;
    result: string;
    started: boolean;
    createdAt: string;
    endedAt: string | null;
}

export interface Bet {
    id: number;
    amount: number;
    winAmount: number;
    endedAt?: string | null;
}

interface GameState {
    gameId: string;
    lastGames: Game[];
    lastBets: Bet[];
    currentBet: Bet | null;

    setGameId(gameId: string): void;
    createBet(gameId: string, clientId: string, amount: number): void;
    setCurrentBet(bet: Bet | null): void;
    getLastGames(): void;
    getLastBets(): void;
}

const errorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) return error.response.data.message as string;
    return "Не удалось связаться с сервером";
};

export const useGameStore = create<GameState>((set, get) => ({
    gameId: "",
    lastGames: [],
    lastBets: [],
    currentBet: null,

    setGameId: (gameId: string) => {
        // Новый раунд — ставка с прошлого раунда больше не актуальна
        if (get().gameId !== gameId) set({ gameId, currentBet: null });
    },
    createBet: (gameId: string, clientId: string, amount: number) => {
        betService
            .createBet(amount, clientId, gameId)
            .then((bet) => {
                set({ currentBet: bet });
                useUserStore.getState().getBalance();
            })
            .catch((error) => toast.warn(errorMessage(error), { position: "bottom-right", theme: "dark" }));
    },
    setCurrentBet: (bet: Bet | null) => {
        set({ currentBet: bet });
    },
    // Бэкенд уже отдаёт списки от новых к старым
    getLastGames: () => {
        gameService
            .getLastGames()
            .then((lastGames) => set({ lastGames }))
            .catch(console.error);
    },
    getLastBets: () => {
        betService
            .getLastBets()
            .then((lastBets) => set({ lastBets }))
            .catch(console.error);
    },
}));
