import Image from "next/image";
import { Card } from "../Card/Card";

import "./TossResults.css";

export const TossResults = ({ coinTosses }: { coinTosses: number[][] }) => {
  return (
    <Card>
      <h3>Coin Tosses:</h3>
      <div className="tossResultsContainer">
        {coinTosses?.map((toss, index) => (
          <div key={toss.join("-")} className="tossResultRow">
            <div className="tossResultImages">
              {toss.map((coin, i) => (
                <Image
                  key={coin + i}
                  src={
                    coin === 3
                      ? "/icons/fengshuicoinheads-icon.png"
                      : "/icons/fengshuicointails-icon.png"
                  }
                  alt={coin === 3 ? "Heads" : "Tails"}
                />
              ))}
            </div>

            <p className="tossResultText">
              <b>Line {index + 1}: </b>
              {toss.map((coin) => (coin === 3 ? "H" : "T")).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
