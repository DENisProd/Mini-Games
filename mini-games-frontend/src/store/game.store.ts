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
    playerId?: number;
    amount: number;
    winAmount: number;
    endedAt?: string | null;
}

export type BetsTab = "all" | "my" | "top";

const fetchBets: Record<BetsTab, () => Promise<Bet[]>> = {
    all: () => betService.getLastBets(),
    my: () => betService.getMyBets(useUserStore.getState().user.clientId),
    top: () => betService.getTopBets(),
};

interface GameState {
    gameId: string;
    lastGames: Game[];
    bets: Record<BetsTab, Bet[]>;
    currentBet: Bet | null;

    setGameId(gameId: string): void;
    createBet(gameId: string, clientId: string, amount: number): void;
    setCurrentBet(bet: Bet | null): void;
    getLastGames(): void;
    getBets(tab: BetsTab): void;
    refreshBets(): void;
}

const errorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) return error.response.data.message as string;
    return "Не удалось связаться с сервером";
};

export const useGameStore = create<GameState>((set, get) => ({
    gameId: "",
    lastGames: [],
    bets: { all: [], my: [], top: [] },
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
    getBets: (tab: BetsTab) => {
        fetchBets[tab]()
            .then((list) => set({ bets: { ...get().bets, [tab]: list } }))
            .catch(console.error);
    },
    refreshBets: () => {
        (Object.keys(fetchBets) as BetsTab[]).forEach((tab) => get().getBets(tab));
    },
}));
