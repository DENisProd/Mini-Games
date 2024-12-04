import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import TabsContainer, { ITab } from "../../shared/TabsContainer/TabsContainer";
import Typography from "../../shared/Typography/Typography";
import Layout from "../../shared/Layout/Layout";
import BetHistoryTile from "./BetHistoryTile/BetHistoryTile";
import { useGameStore } from "../../store/game.store";

const tabs: ITab[] = [
    {
        label: "Все",
        value: "all",
    },
    {
        label: "Мои",
        value: "my",
    },
    {
        label: "Топ",
        value: "top",
    },
];

const Sidebar = () => {
    const { lastBets } = useGameStore();
    const [ selectedTab, setSelectedTab ] = useState<string>("all");

    return (
        <div className={styles.sidebar}>
            <header>
                <TabsContainer tabs={tabs} selected={selectedTab} selectTab={setSelectedTab} className={styles.tabs} fill />
                <Typography variant="h3" text="Всего ставок:" className={styles.subtitle} />
                <Typography variant="h1" text="785" className={styles.title} />
            </header>
            <Layout noPadding>{lastBets && lastBets.length > 0 && lastBets.map((bet) => <BetHistoryTile bet={bet} />)}</Layout>
        </div>
    );
};

export default Sidebar;
