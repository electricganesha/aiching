import { FC } from "react";
import { BACKGROUND_COLOR, HOVER_COLOR } from "../pages/Home";

export const Header: FC = () => {
  return (
    <h1
      className="responsive-header"
      style={{
        border: `1px solid ${HOVER_COLOR}`,
        backgroundColor: HOVER_COLOR,
        color: BACKGROUND_COLOR,
        padding: "8px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        zIndex: -1,
        fontSize: "2.2rem",
        textAlign: "center",
        wordBreak: "break-word",
      }}
    >
      ☯&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I Ching |
      易經&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;☯
    </h1>
  );
};
