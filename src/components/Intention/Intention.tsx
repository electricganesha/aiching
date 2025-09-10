import { FC } from "react";

import styles from "./Intention.module.css";

interface IntentionProps {
  showIntention: boolean;
  intention: string;
  setIntention: (value: string) => void;
}

export const Intention: FC<IntentionProps> = ({
  showIntention,
  intention,
  setIntention,
}) => {
  return (
    <div className={styles.intention}>
      {showIntention ? (
        <textarea
          rows={4}
          cols={48}
          placeholder="E.g. What should I do today?"
          className={styles.intentionTextarea}
          onInput={(e) => setIntention((e.target as HTMLTextAreaElement).value)}
        ></textarea>
      ) : (
        <div className={styles.intentionText}>{intention}</div>
      )}
    </div>
  );
};
