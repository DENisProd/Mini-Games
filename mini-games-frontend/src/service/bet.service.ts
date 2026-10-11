import axios from "axios";
import { Bet } from "../store/game.store";
import { host } from "./api";

async function createBet(amount: number, clientId: string, gameId: string) {
    const bet = await axios.post(host + "/bet/", {
        clientId,
        amount,
        gameId,
    });
    return bet.data.data as Bet;
}

async function getLastBets() {
    const bets = await axios.get(host + "/bet/last");
    return bets.data.data as Bet[];
}

export default {
    createBet,
    getLastBets,
};
