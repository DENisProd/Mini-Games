import React from "react";
import styles from "./BetHistoryTile.module.scss";
import Card from "../../../shared/Card/Card";
import Avatar from "../../../shared/Avatar/Avatar";
import Typography from "../../../shared/Typography/Typography";
import { Bet } from "../../../store/game.store";
import cn from "classnames";
import Multiplier from "../../../shared/Multiplier/Multiplier";

interface Props {
    bet: Bet;
    // Место в рейтинге (для вкладки «Топ»)
    place?: number;
}

const BetHistoryTile: React.FC<Props> = ({ bet, place }) => {
    const isWin = bet.winAmount > 0;
    const mul = bet.winAmount / bet.amount;
    const name = bet.playerId ? `Игрок #${bet.playerId}` : "Игрок";

    return (
        <Card small className={cn(styles.card, isWin && styles.win)}>
            <div className={styles.layout}>
                {place ? (
                    <div className={cn(styles.place, place <= 3 && styles[`place_${place}`])}>{place}</div>
                ) : (
                    <Avatar src="https://i.pinimg.com/originals/a5/e8/1f/a5e81f19cf2c587876fd1bb08ae0249f.png" size={24} />
                )}
                <Typography variant="h3" text={name} />
                <Typography variant="p" text={bet.amount.toFixed(0) + " $"} />
                {isWin ? <Multiplier mul={mul} /> : <div>-</div>}
                {isWin ? <Typography variant="p" text={bet.winAmount.toFixed(0) + " $"} /> : <div>-</div>}
            </div>
        </Card>
    );
};

export default BetHistoryTile;
