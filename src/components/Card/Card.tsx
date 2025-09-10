"use client";

import styles from "./Card.module.css";

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div className={styles.card} {...props}>
      {children}
    </div>
  );
};
