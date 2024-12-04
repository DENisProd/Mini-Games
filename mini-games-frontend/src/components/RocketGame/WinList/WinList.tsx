import React from "react";
import Layout from "../../../shared/Layout/Layout";
import WinElement from "./WinElement/WinElement";
import styles from "./WinList.module.scss";
import { useGameStore } from "../../../store/game.store";

const WinList = () => {
    const { lastGames } = useGameStore();

    return (
        <Layout horizontal className={styles.container}>
            {lastGames.map((m) => (
                <WinElement key={m.id} text={m.result} />
            ))}
            {/* <div className={styles.gradient}/> */}
        </Layout>
    );
};

export default WinList;
