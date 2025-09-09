import { Card } from "./Card";

export const TossResults = ({ coinTosses }: { coinTosses: number[][] }) => {
  return (
    <Card>
      <h3>Coin Tosses:</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginBottom: 8,
        }}
      >
        {coinTosses?.map((toss, index) => (
          <div
            key={toss.join("-")}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {toss.map((coin, i) => (
                <img
                  key={coin + i}
                  src={
                    coin === 3
                      ? "/icons/fengshuicoinheads-icon.png"
                      : "/icons/fengshuicointails-icon.png"
                  }
                  alt={coin === 3 ? "Heads" : "Tails"}
                  style={{ width: 56, height: 56 }}
                />
              ))}
            </div>

            <p>
              <b>Line {index + 1}: </b>
              {toss.map((coin) => (coin === 3 ? "H" : "T")).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
