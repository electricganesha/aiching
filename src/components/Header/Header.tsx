"use client";

import styles from "./Header.module.css";

import Image from "next/image";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Image
        src="/logo/logo.png"
        alt="I-Chingify Logo"
        width={56}
        height={56}
      />
      <h1>I-Chingify 易經</h1>
      <h3>Reflect. Consult. Learn.</h3>
    </div>
  );
};
