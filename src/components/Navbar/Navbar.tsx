"use client";

import { FC } from "react";
import { Header } from "../Header/Header";
import Link from "next/link";

import styles from "./Navbar.module.css";

export const Navbar: FC = () => {
  return (
    <nav className={styles.navbar}>
      <Header />
      <div>
        <Link href="/" className={styles.navbar__link}>
          Home
        </Link>
        <Link href="/about" className={styles.navbar__link}>
          About
        </Link>
      </div>
    </nav>
  );
};
