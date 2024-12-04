import React, { useEffect } from "react";
import styles from "./Header.module.scss";
import GraduationCap from "../../assets/graduation_cap.svg";
import { CircleHelp, WalletMinimal } from "lucide-react";
import Button from "../../shared/Button/Button";
import { useUserStore } from "../../store/user.store";

const Header = () => {
    const { balance, getBalance } = useUserStore();

    useEffect(() => {
        getBalance();
    }, [])

    return (
        <div className={styles.header}>
            <div className={styles.title}>
                <img src={GraduationCap} className={styles.logo} />
                <span>
                    <span className={styles.primary}>Lucky</span>
                    <span>Student</span>
                </span>
            </div>

            <div className={styles.buttons_container}>
                <Button type="secondary">
                    <CircleHelp size={16} /> <span className={styles.text}>Как играть?</span>
                </Button>
                <Button type="secondary">
                    <WalletMinimal size={16} /> {balance.toFixed(2)} $
                </Button>
            </div>
        </div>
    );
};

export default Header;
