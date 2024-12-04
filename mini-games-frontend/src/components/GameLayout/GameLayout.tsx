import React from "react";
import styles from "./GameLayout.module.scss";

interface Props {
    children: React.ReactNode;
}

const GameLayout: React.FC<Props> = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};

export default GameLayout;
