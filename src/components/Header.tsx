import { FC } from "react";
import { BACKGROUND_COLOR, HOVER_COLOR } from "./IChing";

export const Header: FC = () => {
  return (
    <h1
      style={{
        textAlign: "center",
        border: `1px solid ${HOVER_COLOR}`,
        backgroundColor: HOVER_COLOR,
        color: BACKGROUND_COLOR,
        width: "480px",
        margin: "0 auto",
        padding: "8px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        zIndex: -1,
      }}
    >
      ☯&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I Ching |
      易經&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;☯
    </h1>
  );
};
