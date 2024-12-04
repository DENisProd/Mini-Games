import React from "react";
import styles from "./Avatar.module.scss";
import cn from "classnames";

interface Props {
    src: string;
    size?: number;
    className?: string;
}

const Avatar: React.FC<Props> = ({ src, size, className }) => {
    return <img src={src} alt={"avatar"} className={cn(styles.avatar, className)} style={{ width: size, height: size }} />;
};

export default Avatar;
