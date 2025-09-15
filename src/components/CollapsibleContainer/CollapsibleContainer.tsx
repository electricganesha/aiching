import { useState } from "react";
import styles from "./CollapsibleContainer.module.css";

export const CollapsibleContainer = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={styles.collapsibleContainer}>
      <button
        aria-pressed={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={styles.toggleButton}
      >
        <div className={styles.title}>{title}</div>
      </button>
      <div
        className={
          styles.collapsibleContent +
          (isOpen ? " " + styles.collapsibleContent__expanded : "")
        }
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};
