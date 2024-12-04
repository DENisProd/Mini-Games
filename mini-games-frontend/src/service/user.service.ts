import axios from "axios";
import { host } from "./bet.service";

async function getUserBalance(clientId: string) {
    const balance = await axios.get(host + "/account?clientId=" + clientId);
    return balance.data.data as number;
}

export default {
    getUserBalance,
}