"use client";

import { FC } from "react";
import { Header } from "../Header/Header";
import Link from "next/link";

import styles from "./Navbar.module.css";
import SignInPopupButton from "../SignInPopupButton/SignInPopupButton";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const Navbar: FC = () => {
  const session = useSession();
  const pathname = usePathname();

  if (pathname.includes("/auth")) return null;

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
        {session.data?.user ? (
          <button onClick={() => signOut()} className={styles.navbar__button}>
            Sign Out
          </button>
        ) : (
          <SignInPopupButton />
        )}
      </div>
    </nav>
  );
};
