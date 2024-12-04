import React from "react";
import cn from "classnames";
import styles from "./Button.module.scss";
import { LoaderCircle } from "lucide-react";

interface Props {
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
    type?: "primary" | "secondary" | "tertiary" | "transparent" | "danger";
    fontSize?: "regular" | "bold";
    disabled?: boolean;
    circle?: boolean;
    hover?: "hover-light" | "none";
    onClick?: () => void;
    className?: string;
    isSubmit?: boolean;
    isLoading?: boolean;
    border?: boolean;
    noPadding?: boolean;
}

const Button: React.FC<Props> = ({ children, size, type, disabled, onClick, fontSize, hover, className, circle, isSubmit, isLoading, border, noPadding }) => {
    return (
        <button 
            className={cn(
                styles.Button, 
                styles[size || "medium"], 
                styles[type || "primary"], 
                styles[fontSize || "bold"], 
                styles[hover || "hover-light"],
                circle && styles.circle, 
                border && styles.border,
                noPadding && styles.no_padding,
                className
            )} 
            type={isSubmit ? "submit" : "button"}
            onClick={onClick} 
            disabled={disabled}
        >
            {isLoading && <LoaderCircle className={styles.loader}/> }
            {children}
        </button>
    );
};

export default Button;
