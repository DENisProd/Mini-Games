import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Layer, Stage, Image as KonvaImage, Text } from "react-konva";
import RocketImage from "../../assets/rocket.png";
import useImage from "use-image";
import WinList from "./WinList/WinList";
import Layout from "../../shared/Layout/Layout";
import styles from "./Game.module.scss";
import BetCard from "./BetCard/BetCard";
import { Bet, useGameStore } from "../../store/game.store";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameBackground, { Position } from "./Background/GameBackground";
import { host } from "../../service/bet.service";
import { useUserStore } from "../../store/user.store";

const Game = () => {
    const { setGameId, getLastGames, getLastBets, resetCurrentBet } = useGameStore();
    const { getBalance } = useUserStore();

    const [multiplier, setMultiplier] = useState<number>(0.0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const clientRef = useRef<Client | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [rocketPosition, setRocketPosition] = useState<{ x: number; y: number }>({ x: 200, y: 400 });
    const [rocketRotation, setRocketRotation] = useState<number>(80);
    const [backgroundPosition, setBackgroundPosition] = useState<{ x: number; y: number }>({ x: -100, y: 0 });

    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const [waitTime, setWaitTime] = useState<number>(0);
    const [rocketImage] = useImage(RocketImage);

    const resetPosition = () => {
        setRocketPosition({ x: (stageSize.width / 10), y: stageSize.height - (stageSize.height / 4) });
        setBackgroundPosition({ x: -100, y: 0 });
        setRocketRotation(80);
    };

    const startGame = () => {
        if (clientRef.current) {
            clientRef.current.publish({ destination: "/app/start" });
        }
    };

    const refreshData = () => {
        setTimeout(() => {
            getBalance();
            getLastGames();
            getLastBets();
        }, 100);
    };

    useEffect(() => {
        const socket = new SockJS(host + "/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
        });

        client.onConnect = (frame) => {
            console.log("Connected: " + frame);
            refreshData();
            client.subscribe("/topic/multiplier", (message) => {
                if (message.body) {
                    const newMultiplier = +JSON.parse(message.body);
                    setMultiplier(newMultiplier);
                }
            });
            client.subscribe("/topic/crush", (message) => {
                if (message.body) {
                    console.log("Received crush:", JSON.parse(message.body));
                    setGameOver(true);
                    refreshData();
                }
            });
            client.subscribe("/topic/error", (message) => {
                if (message.body) {
                    console.log("error", message.body);
                    toast.warn(message.body, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            });
            client.subscribe("/topic/win", (message) => {
                if (message.body) {
                    const win = JSON.parse(message.body) as Bet;
                    toast.success(`Вы выиграли ${win.winAmount.toFixed()} $`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            });
            client.subscribe("/topic/waitTime", (message) => {
                if (message.body) {
                    setGameId(JSON.parse(message.body).gameId);
                    console.log(rocketPosition)
                    const _waitTime = +JSON.parse(message.body).time;
                    setWaitTime(_waitTime);
                    if (_waitTime === 19) {
                        resetCurrentBet();
                    }
                    if (_waitTime > 1) {
                        if (!gameOver) {
                            setGameOver(true);
                        }
                    }
                    if (+_waitTime === 1) {
                        resetPosition();
                        setGameOver(false);
                    }
                }
            });

            startGame();
        };

        client.onStompError = (frame) => {
            console.error("STOMP Error: ", frame);
        };

        client.activate();
        clientRef.current = client;

        resetPosition();

        return () => {
            client.deactivate();
        };
    }, []);

    const withdraw = (clientId: string, gameId: string, betId: number) => {
        if (clientRef.current && clientRef.current.connected) {
            const betInfo = {
                clientId: clientId,
                gameId: gameId,
                betId: betId,
            };
            console.log("вывожу");

            clientRef.current.publish({
                destination: "/app/withdraw",
                body: JSON.stringify(betInfo),
            });

            console.log("Bet sent:", betInfo);
        }
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                console.log(containerRef.current.clientWidth);
                setStageSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            if (!gameOver) {
                const mul: Position = {
                    x: 0.2,
                    y: 0.1,
                };
                setBackgroundPosition((prev) => ({
                    x: prev.x - mul.x + stageSize.width * 2,
                    y: (prev.y + mul.y) % stageSize.height,
                }));
                // setRocketRotation((prev) => (prev -= 0.01));
                // setRocketPosition((prev) => ({ x: prev.x + 0.02, y: prev.y - 0.015 }));

                // Генерация случайного сдвига для тряски
                const shakeX = (Math.random() - 0.5) * 1.8; // Случайный сдвиг по оси X
                const shakeY = (Math.random() - 0.5) * 1.8; // Случайный сдвиг по оси Y

                setRocketPosition((prev) => ({
                    x: prev.x + 0.02 + shakeX, // Плавное движение с добавлением случайного сдвига по X
                    y: prev.y - 0.015 + shakeY, // Плавное движение с добавлением случайного сдвига по Y
                }));

                // Генерация случайного изменения для тряски поворота
                const shakeRotation = (Math.random() - 0.5) * 1.2; // Случайное изменение угла поворота

                // Обновление поворота ракеты с тряской
                setRocketRotation((prev) => prev - 0.01 + shakeRotation); // Плавное вращение с добавлением случайного трясущего сдвига

                animationFrameId = requestAnimationFrame(animate); // Сохраняем ID кадра
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameOver, stageSize]);

    const handleRestart = () => {
        // startGame();
        resetPosition();
    };

    return (
        <>
            <Layout noPadding className={styles.relative}>
                <WinList />
                <div ref={containerRef} className={styles.container}>
                    <Stage width={stageSize.width} height={stageSize.height}>
                        <GameBackground backgroundPosition={backgroundPosition} stageSize={stageSize} />
                        <Layer>
                            {/* Изображение ракеты */}
                            {rocketImage && (
                                <KonvaImage
                                    image={rocketImage}
                                    x={rocketPosition.x + 50}
                                    y={rocketPosition.y}
                                    width={stageSize.width * 0.1}
                                    height={stageSize.height * 0.2}
                                    rotation={rocketRotation}
                                />
                            )}
                            {gameOver && (
                                <Text
                                    text={`Игра окончена`}
                                    fontSize={32}
                                    fill="white"
                                    stroke="black" // Цвет обводки
                                    strokeWidth={1} // Ширина обводки
                                    x={stageSize.width / 2}
                                    y={stageSize.height * 0.1}
                                    offsetX={30} // Центрирование по X
                                    offsetY={12} // Центрирование по Y
                                />
                            )}
                            <Text
                                text={`${multiplier.toFixed(2)}x`}
                                fontSize={32}
                                fill="white"
                                stroke="black" // Цвет обводки
                                strokeWidth={1} // Ширина обводки
                                x={stageSize.width / 2}
                                y={stageSize.height / 2}
                                offsetX={30} // Центрирование по X
                                offsetY={12} // Центрирование по Y
                            />
                        </Layer>
                    </Stage>
                </div>
                <Layout horizontal noPadding wrap>
                    <BetCard isGameStarted={waitTime === 1 && !gameOver} withdrawHandler={withdraw} />
                    {waitTime > 1 && <div>Начало игры через: {waitTime}</div>}
                </Layout>
            </Layout>
            <ToastContainer />
        </>
    );
};

export default Game;
