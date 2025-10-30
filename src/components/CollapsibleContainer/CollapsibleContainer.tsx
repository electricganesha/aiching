import { useState } from "react";
import styles from "./CollapsibleContainer.module.css";
import { Button } from "../Button/Button";

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
      <div className={styles.title}>{title}</div>
      <div
        className={`${styles.closeButtonContainerTop} ${
          isOpen ? styles.closeButtonContainerTop__visible : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          onClick={() => setIsOpen(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div
        className={
          styles.collapsibleContent +
          (isOpen ? " " + styles.collapsibleContent__expanded : "")
        }
        aria-hidden={!isOpen}
      >
        {children}
      </div>
      <div className={styles.closeButtonContainer}>
        <Button
          className={styles.closeButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide details" : "View details"}
        </Button>
      </div>
    </div>
  );
};
