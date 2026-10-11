import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import WinList from "./WinList/WinList";
import Layout from "../../shared/Layout/Layout";
import styles from "./Game.module.scss";
import BetCard from "./BetCard/BetCard";
import { Bet, useGameStore } from "../../store/game.store";

import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { host } from "../../service/api";
import { useUserStore } from "../../store/user.store";
import RocketScene from "./Scene/RocketScene";
import { createSceneState, GamePhase, SceneState } from "./Scene/scene";

const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    theme: "dark",
};

const refreshData = () => {
    useUserStore.getState().getBalance();
    useGameStore.getState().getLastGames();
    useGameStore.getState().refreshBets();
};

const Game = () => {
    const clientRef = useRef<Client | null>(null);
    // Состояние для анимации живёт в ref: сообщения о множителе приходят
    // 10 раз в секунду и не должны перерисовывать React-дерево.
    const sceneRef = useRef<SceneState>(createSceneState());

    // В React-стейт попадает только то, что меняется редко
    const [phase, setPhase] = useState<GamePhase>("waiting");
    const [waitTime, setWaitTime] = useState<number>(0);

    useEffect(() => {
        const changePhase = (next: GamePhase) => {
            const scene = sceneRef.current;
            if (scene.phase !== next) {
                scene.phase = next;
                scene.phaseStartedAt = performance.now();
                setPhase(next);
            }
        };

        const client = new Client({
            // Фабрика должна создавать новый сокет, иначе переподключение не работает
            webSocketFactory: () => new SockJS(host + "/ws"),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            refreshData();

            client.subscribe("/topic/multiplier", (message) => {
                if (!message.body) return;
                sceneRef.current.multiplier = +JSON.parse(message.body);
                changePhase("flying");
            });
            client.subscribe("/topic/crush", (message) => {
                if (!message.body) return;
                sceneRef.current.multiplier = +JSON.parse(message.body);
                changePhase("crashed");
                refreshData();
            });
            client.subscribe("/topic/waitTime", (message) => {
                if (!message.body) return;
                const { gameId, time } = JSON.parse(message.body) as { gameId: string; time: number };
                useGameStore.getState().setGameId(gameId);
                sceneRef.current.waitTime = time;
                setWaitTime(time);
                changePhase("waiting");
            });
            client.subscribe("/user/queue/win", (message) => {
                if (!message.body) return;
                const win = JSON.parse(message.body) as Bet;
                useGameStore.getState().setCurrentBet(win);
                useUserStore.getState().getBalance();
                toast.success(`Вы выиграли ${win.winAmount.toFixed(2)} $`, toastOptions);
            });
            client.subscribe("/user/queue/errors", (message) => {
                if (message.body) toast.warn(message.body, toastOptions);
            });

            client.publish({ destination: "/app/start" });
        };

        client.onStompError = (frame) => {
            console.error("STOMP Error: ", frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current = null;
            client.deactivate();
        };
    }, []);

    const withdraw = useCallback((clientId: string, gameId: string, betId: number) => {
        const client = clientRef.current;
        if (client && client.connected) {
            client.publish({
                destination: "/app/withdraw",
                body: JSON.stringify({ clientId, gameId, betId }),
            });
        }
    }, []);

    return (
        <>
            <Layout noPadding className={styles.relative}>
                <WinList />
                <RocketScene scene={sceneRef} className={styles.container} />
                <Layout horizontal noPadding wrap>
                    <BetCard isGameStarted={phase === "flying"} withdrawHandler={withdraw} />
                    {phase === "waiting" && waitTime > 0 && <div>Начало игры через: {waitTime}</div>}
                </Layout>
            </Layout>
            <ToastContainer />
        </>
    );
};

export default Game;
