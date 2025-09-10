"use client";

import "./Navbar.css";
import { FC } from "react";
import { Header } from "../Header/Header";
import Link from "next/link";

export const Navbar: FC = () => {
  return (
    <nav className="navbar">
      <Header />
      <div>
        <Link href="/" className="navbar-link">
          Home
        </Link>
        <Link href="/about" className="navbar-link">
          About
        </Link>
      </div>
    </nav>
  );
};
