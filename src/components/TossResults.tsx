export const TossResults = ({ coinTosses }: { coinTosses: number[][] }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h3>Coin Tosses:</h3>
      {coinTosses?.map((toss, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        >
          <div style={{ display: "flex", gap: 8, marginRight: 12 }}>
            {toss.map((coin, i) => (
              <img
                key={i}
                src={
                  coin === 3
                    ? "/icons/fengshuicoinheads-icon.png"
                    : "/icons/fengshuicointails-icon.png"
                }
                alt={coin === 3 ? "Heads" : "Tails"}
                style={{ width: 40, height: 40 }}
              />
            ))}
          </div>
          <p>
            Line {index + 1}:{" "}
            {toss.map((coin) => (coin === 3 ? "H" : "T")).join(", ")} (Total:{" "}
            {toss.reduce((sum, coin) => sum + coin, 0)})
          </p>
        </div>
      ))}
    </div>
  );
};
