"use client";

import { FC } from "react";
import { Header } from "../Header/Header";
import Link from "next/link";

import styles from "./Navbar.module.css";
import SignInPopupButton from "../SignInPopupButton/SignInPopupButton";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "../Button/Button";

export const Navbar: FC = () => {
  const session = useSession();
  const pathname = usePathname();

  if (pathname.includes("/auth")) return null;

  return (
    <nav className={styles.navbar}>
      <Header />
      <div className={styles.navbar__links}>
        <Link href="/" className={styles.navbar__link}>
          Home
        </Link>

        <Link href="/about" className={styles.navbar__link}>
          About
        </Link>
        {session.data?.user ? (
          <>
            <Link href="/history" className={styles.navbar__link}>
              History
            </Link>
            <Link href="/profile" className={styles.navbar__link}>
              Profile
            </Link>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <SignInPopupButton />
        )}
      </div>
    </nav>
  );
};
