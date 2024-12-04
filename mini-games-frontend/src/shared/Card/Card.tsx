import React from "react";
import styles from "./Card.module.scss";
import cn from "classnames";

interface Props {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    negative?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    small?: boolean;
    userSelectBlock?: boolean;
}

const Card: React.FC<Props> = ({
    children,
    title,
    icon,
    negative = false,
    className,
    style,
    onClick,
    small,
    userSelectBlock,
}: Props) => {
    const transparent = false;
    return (
        <div
            className={cn(styles.Card, negative && styles.negative, small && styles.small, transparent && styles.transparent, userSelectBlock && styles.user_select_block, className)}
            style={style}
            onClick={onClick}
        >
            {title && (
                <div className={styles.header}>
                    {icon}
                    {title}
                </div>
            )}
            {/* <div className={cn(styles.body, className)}>{children}</div> */}
            {children}
        </div>
    );
};

export default Card;
