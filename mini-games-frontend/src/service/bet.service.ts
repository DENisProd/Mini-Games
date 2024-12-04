import axios from "axios"
import { Bet } from "../store/game.store";

// export const host = "http://localhost:8080";
export const host = "http://192.168.0.150:8080";

async function createBet (amount: number, clientId: string, gameId: string) {
    const bet = await axios.post(host+"/bet/", {
        clientId,
        amount,
        gameId
    })
    return bet.data.data as Bet;
}

async function getLastBets () {
    const bets = await axios.get(host+"/bet/last");
    return bets.data.data as Bet[];
}

// async function withdrawBet(betId: number, clientId: string, gameId: string) {
//     const res = await axios.post("http://localhost:8080/bet/withdraw");
// }

export default {
    createBet,
    getLastBets,
}