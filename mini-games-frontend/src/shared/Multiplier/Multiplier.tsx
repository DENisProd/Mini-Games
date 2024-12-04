import React from 'react'
import styles from './Multiplier.module.scss';
import cn from 'classnames';

interface Props {
    mul: number;
}

const Multiplier: React.FC<Props> = ({ mul }) => {
  return (
    <div className={cn(styles.element, mul > 6 && styles.orange, mul < 2 && styles.blue)}>{mul.toFixed(2)}x</div>
  )
}

export default Multiplier
