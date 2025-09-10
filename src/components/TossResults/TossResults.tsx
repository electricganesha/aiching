import Image from "next/image";
import { Card } from "../Card/Card";

import styles from "./TossResults.module.css";

export const TossResults = ({ coinTosses }: { coinTosses: number[][] }) => {
  return (
    <Card>
      <h3>Coin Tosses:</h3>
      <div className={styles.tossResultsContainer}>
        {coinTosses?.map((toss, index) => (
          <div key={toss.join("-") + index} className={styles.tossResultRow}>
            <div className={styles.tossResultImages}>
              {toss.map((coin, i) => (
                <Image
                  key={toss.join("-") + coin + i}
                  src={
                    coin === 3
                      ? "/icons/fengshuicoinheads-icon.png"
                      : "/icons/fengshuicointails-icon.png"
                  }
                  width={48}
                  height={48}
                  alt={coin === 3 ? "Heads" : "Tails"}
                />
              ))}
            </div>

            <p className={styles.tossResultText}>
              <b>Line {index + 1}: </b>
              {toss.map((coin) => (coin === 3 ? "H" : "T")).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
