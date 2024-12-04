import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../../shared/Button/Button";
import Card from "../../../shared/Card/Card";
import Layout from "../../../shared/Layout/Layout";
import styles from "./BetCard.module.scss";
import { useUserStore } from "../../../store/user.store";
import { useGameStore } from "../../../store/game.store";
import cn from "classnames";

interface Props {
    isGameStarted: boolean;
    withdrawHandler: (clientId: string, gameId: string, betId: number) => void;
}

const BetCard: React.FC<Props> = ({ isGameStarted, withdrawHandler }) => {
    const { user, getBalance } = useUserStore();
    const { gameId, createBet, currentBet } = useGameStore();
    const [amount, setAmount] = useState<number>(10);

    const amountHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "");
        setAmount(Number(value) || 0);
    };

    const addHandler = (_amount: number) => {
        setAmount((prevAmount) => prevAmount + _amount);
    };

    const createBet1 = () => {
        if (!isGameStarted) createBet(gameId, user.clientId, amount);
        else if (isGameStarted && currentBet && withdrawHandler) withdrawHandler(user.clientId, gameId, currentBet.id);
    };

    useEffect(() => {
        getBalance();
    }, [currentBet])

    return (
        <Card className={cn(styles.card, isGameStarted && styles.blocked)}>
            <Layout horizontal noPadding className={styles.container}>
                <Layout noPadding>
                    <Layout horizontal noPadding spaceBetween>
                        <Button type="secondary" onClick={() => addHandler(-1)}>
                            -
                        </Button>
                        <input type="text" value={amount} onChange={(event) => amountHandler(event)} className={styles.input} />
                        <Button type="secondary" onClick={() => addHandler(1)}>
                            +
                        </Button>
                    </Layout>
                    <Layout noPadding horizontal align>
                        <Button type="secondary" onClick={() => addHandler(50)}>
                            +50
                        </Button>
                        <Button type="secondary" onClick={() => addHandler(100)}>
                            +100
                        </Button>
                        <Button type="secondary" onClick={() => addHandler(200)}>
                            +200
                        </Button>
                        <Button type="secondary" onClick={() => addHandler(500)}>
                            +500
                        </Button>
                    </Layout>
                </Layout>
                <Button className={styles.bet_button} onClick={createBet1} disabled={!isGameStarted && !!currentBet} type={isGameStarted ? (currentBet ? "primary" : "secondary") : currentBet ? "secondary" : "primary"}>
                    {isGameStarted ? "ЗАБРАТЬ" : "СТАВКА"}
                </Button>
            </Layout>
        </Card>
    );
};

export default BetCard;
