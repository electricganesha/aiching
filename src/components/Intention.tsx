import { FC } from "react";
import { HOVER_COLOR } from "../pages/Home";

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
    <div
      className="responsive-flex"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {showIntention ? (
        <textarea
          rows={4}
          cols={48}
          placeholder="E.g. What should I do today?"
          style={{
            resize: "none",
            padding: 8,
            fontSize: 12,
            borderRadius: 8,
            border: `1px solid ${HOVER_COLOR}`,
            color: HOVER_COLOR,
            textAlign: "center",
            verticalAlign: "middle",
            width: window.innerWidth < 768 ? "92%" : "auto", // Adjust width for mobile
          }}
          onInput={(e) => setIntention((e.target as HTMLTextAreaElement).value)}
          onFocus={(e) => {
            e.target.style.outline = "none";
            e.target.style.border = `1px solid ${HOVER_COLOR}`;
          }}
          onBlur={(e) => {
            e.target.style.border = `1px solid ${HOVER_COLOR}`;
            e.target.style.color = HOVER_COLOR;
          }}
        ></textarea>
      ) : (
        <p>{intention}</p>
      )}
    </div>
  );
};
