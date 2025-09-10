import { FC } from "react";

import "./Intention.css";

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
    <div className="intention">
      {showIntention ? (
        <textarea
          rows={4}
          cols={48}
          placeholder="E.g. What should I do today?"
          className="intention-textarea"
          onInput={(e) => setIntention((e.target as HTMLTextAreaElement).value)}
        ></textarea>
      ) : (
        <p>{intention}</p>
      )}
    </div>
  );
};
