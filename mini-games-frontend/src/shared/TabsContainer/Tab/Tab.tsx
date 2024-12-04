import React from "react";
import styles from "./Tab.module.scss";
import cn from "classnames";
import { ITab } from "../TabsContainer";
import Button from "../../Button/Button";

interface Props {
    label?: string;
    active?: boolean;
    selectTabHandler: (value: string) => void;
    tab: ITab;
}

const Tab: React.FC<Props> = ({ active, selectTabHandler, tab }) => {
    return (
        <Button
            onClick={() => selectTabHandler(tab.value)}
            className={cn(styles.Tab, active && styles.active)}
            type={active ? "primary" : "tertiary" }
            hover={"none"}
            fontSize={"regular"}
        >
            {tab?.icon}
            {tab?.label}
        </Button>
    );
};

export default Tab;
