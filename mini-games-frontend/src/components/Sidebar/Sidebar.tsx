import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import TabsContainer, { ITab } from "../../shared/TabsContainer/TabsContainer";
import Typography from "../../shared/Typography/Typography";
import Layout from "../../shared/Layout/Layout";
import BetHistoryTile from "./BetHistoryTile/BetHistoryTile";
import { BetsTab, useGameStore } from "../../store/game.store";

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

const subtitles: Record<BetsTab, string> = {
    all: "Последние ставки:",
    my: "Мои ставки:",
    top: "Крупнейшие выигрыши:",
};

const emptyTexts: Record<BetsTab, string> = {
    all: "Ставок пока нет",
    my: "Вы ещё не делали ставок",
    top: "Выигрышей пока нет",
};

const Sidebar = () => {
    const [selectedTab, setSelectedTab] = useState<BetsTab>("all");
    const bets = useGameStore((state) => state.bets[selectedTab]);
    const getBets = useGameStore((state) => state.getBets);

    // При переключении вкладки подтягиваем свежие данные
    useEffect(() => {
        getBets(selectedTab);
    }, [selectedTab, getBets]);

    return (
        <div className={styles.sidebar}>
            <header>
                <TabsContainer
                    tabs={tabs}
                    selected={selectedTab}
                    selectTab={(value) => setSelectedTab(value as BetsTab)}
                    className={styles.tabs}
                    fill
                />
                <Typography variant="h3" text={subtitles[selectedTab]} className={styles.subtitle} />
                <Typography variant="h1" text={String(bets.length)} className={styles.title} />
            </header>
            <Layout noPadding>
                {bets.length > 0 ? (
                    bets.map((bet, index) => <BetHistoryTile key={bet.id} bet={bet} place={selectedTab === "top" ? index + 1 : undefined} />)
                ) : (
                    <div className={styles.empty}>{emptyTexts[selectedTab]}</div>
                )}
            </Layout>
        </div>
    );
};

export default Sidebar;
