import { FC } from "react";

import styles from "./Hero.module.css";
import Image from "next/image";

export const Hero: FC = () => {
  return (
    <section className={styles.hero}>
      <Image src="/logo/logo.png" alt="aiChing Logo" width={128} height={128} />
      <h1>aiChing</h1>
      <p>
        Discover ancient wisdom through the digital casting of coins. Let the
        Book of Changes guide your path with timeless insights.
      </p>
      <div className={styles.features}>
        <div className={styles.featureBox}>
          <span style={{ fontSize: 32 }}>⛩️</span>
          <h1>Ancient Wisdom</h1>
          <p>Access 5,000 years of Chinese philosophical guidance</p>
        </div>
        <div className={styles.featureBox}>
          <span style={{ fontSize: 32 }}>🎲</span>

          <h1>Digital Casting</h1>

          <p>Authentic coin tossing simulation with true randomness</p>
        </div>
        <div className={styles.featureBox}>
          <span style={{ fontSize: 32 }}>☯️</span>

          <h1>Personal Insights</h1>

          <p>Tailored interpretations based on your intentions</p>
        </div>
      </div>
      <button
        className={styles.hero__button}
        onClick={() => {
          const nextSection = document.getElementById("main-layout");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Start Your Journey
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
          />
        </svg>
      </button>
      <h3>No registration required • Free to use • Ancient wisdom awaits</h3>
    </section>
  );
};
