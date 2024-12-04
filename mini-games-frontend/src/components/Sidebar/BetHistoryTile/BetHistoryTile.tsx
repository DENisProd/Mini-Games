import React from 'react'
import styles from "./BetHistoryTile.module.scss";
import Card from '../../../shared/Card/Card';
import Layout from '../../../shared/Layout/Layout';
import Avatar from '../../../shared/Avatar/Avatar';
import Typography from '../../../shared/Typography/Typography';
import { Bet } from '../../../store/game.store';
import cn from 'classnames';
import Multiplier from '../../../shared/Multiplier/Multiplier';

interface Props {
  bet: Bet;
}

const BetHistoryTile: React.FC<Props> = ({ bet }) => {
  // const mul = parseFloat(text.replace(',', '.'));
  const mul = bet.winAmount / bet.amount;

  return (
    <Card small className={cn(styles.card, mul > 0 && styles.win)}>
        <div className={styles.layout}>
            <Avatar src="https://i.pinimg.com/originals/a5/e8/1f/a5e81f19cf2c587876fd1bb08ae0249f.png" size={24}/>
            <Typography variant='h3' text="Ivan" />
            <Typography variant='p' text={bet.amount.toFixed(0) + " $"} />
            {bet.winAmount > 0 ? <Multiplier mul={mul}/> : <div>-</div>}
            {bet.winAmount > 0 ? <Typography variant='p' text={bet.winAmount.toFixed(0) + " $"} /> : <div>-</div>}
        </div>
    </Card>
  )
}

export default BetHistoryTile
