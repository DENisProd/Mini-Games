import { ChangeEvent, useState } from "react";
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
    const { user } = useUserStore();
    const { gameId, createBet, currentBet } = useGameStore();
    const [amount, setAmount] = useState<number>(10);

    const amountHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "");
        setAmount(Number(value) || 0);
    };

    const addHandler = (_amount: number) => {
        setAmount((prevAmount) => Math.max(1, prevAmount + _amount));
    };

    const isWithdrawn = !!currentBet && currentBet.winAmount > 0;
    // Во время полёта забрать можно только свою невыведенную ставку,
    // до старта — сделать одну ставку на раунд
    const canWithdraw = isGameStarted && !!currentBet && !isWithdrawn;
    const canBet = !isGameStarted && !currentBet && amount > 0 && !!gameId;

    const betHandler = () => {
        if (canBet) createBet(gameId, user.clientId, amount);
        else if (canWithdraw && currentBet) withdrawHandler(user.clientId, gameId, currentBet.id);
    };

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
                <Button
                    className={styles.bet_button}
                    onClick={betHandler}
                    disabled={isGameStarted ? !canWithdraw : !canBet}
                    type={(isGameStarted ? canWithdraw : canBet) ? "primary" : "secondary"}
                >
                    {isWithdrawn ? "ВЫВЕДЕНО" : isGameStarted ? "ЗАБРАТЬ" : currentBet ? "СТАВКА СДЕЛАНА" : "СТАВКА"}
                </Button>
            </Layout>
        </Card>
    );
};

export default BetCard;
