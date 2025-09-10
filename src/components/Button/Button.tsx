import { FC, ReactNode } from "react";

import styles from "./Button.module.css";

export const Button: FC<
  { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
