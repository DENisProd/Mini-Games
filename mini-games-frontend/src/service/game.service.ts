import axios from "axios";
import { Game } from "../store/game.store";
import { host } from "./bet.service";

async function getLastGames () {
    const bets = await axios.get(host + "/game/");
    return bets.data as Game[];
}

export default {
    getLastGames,
}