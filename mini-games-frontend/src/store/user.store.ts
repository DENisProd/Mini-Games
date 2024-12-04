import { create } from "zustand";
import userService from "../service/user.service";

interface Account {
    id: number;
    balance: number;
    userId: number;
    user: User;
}

interface User {
    id: number;
    clientId: string;
    serverId: string;
    accountId?: number;
    account?: Account;
}

interface UserStore {
    user: User;
    balance: number;

    getBalance: () => void;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: {
        id: 1,
        clientId: "erg87e4y4yfe4yyf4",
        serverId: "g45g5tgegf4f4",
    },
    balance: 0,

    getBalance: () => {
        const { user } = get();
        userService.getUserBalance(user?.clientId).then((balance) => set({ balance }));
    },
    setUser: (user: User) => {
        set({ user });
    },
}))