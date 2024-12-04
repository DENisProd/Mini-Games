import React from "react";
import styles from "./Layout.module.scss";
import cn from "classnames";

interface Props {
    children: React.ReactNode;
    horizontal?: boolean;
    className?: string;
    noPadding?: boolean;
    spaceBetween?: boolean;
    paddingBottom?: boolean;
    relative?: boolean;
    center?: boolean;
    wrap?: boolean;
    align?: boolean;
}

const Layout: React.FC<Props> = ({
    children,
    horizontal = false,
    className,
    noPadding = false,
    spaceBetween,
    paddingBottom,
    relative,
    center,
    wrap,
    align,
}: Props) => {
    return (
        <div
            className={cn(
                styles.Layout,
                horizontal && styles.horizontal,
                className,
                noPadding && styles.no_padding,
                spaceBetween && styles.space_between,
                paddingBottom && styles.padding_bottom,
                relative && styles.relative,
                center && styles.center,
                wrap && styles.wrap,
                align && styles.align,
            )}
        >
            {children}
        </div>
    );
};

export default Layout;
