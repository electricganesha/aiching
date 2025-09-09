import { FC } from "react";
import { Header } from "./Header";
import { Link } from "react-router-dom";
import { HOVER_COLOR } from "../pages/Home";

export const Navbar: FC = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        marginBottom: "28px",
        borderBottom: `1px solid ${HOVER_COLOR}`,
      }}
    >
      <Header />
      <div>
        <Link
          to="/"
          style={{
            margin: "0 10px",
            textDecoration: "none",
            color: HOVER_COLOR,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "firebrick";
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = HOVER_COLOR;
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{
            margin: "0 10px",
            textDecoration: "none",
            color: HOVER_COLOR,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "firebrick";
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = HOVER_COLOR;
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          About
        </Link>
      </div>
    </nav>
  );
};
