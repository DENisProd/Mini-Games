import axios from "axios";
import { host } from "./api";

async function getUserBalance(clientId: string) {
    const balance = await axios.get(host + "/account", { params: { clientId } });
    return balance.data.data as number;
}

export default {
    getUserBalance,
}