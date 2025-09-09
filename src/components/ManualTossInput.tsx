import { FC, useState } from "react";
import { BACKGROUND_COLOR, HOVER_COLOR } from "../pages/Home";

interface ManualTossInputProps {
  manualMode: boolean;
  setCoinTosses: (tosses: number[][]) => void;
  setTossed: (tossed: boolean) => void;
  setIsShowingCanvas: (show: boolean) => void;
  setManualMode: (mode: boolean) => void;
  setIsHoveredManual: (hovered: boolean) => void;
}

export const ManualTossInput: FC<ManualTossInputProps> = ({
  manualMode,
  setCoinTosses,
  setTossed,
  setIsShowingCanvas,
  setManualMode,
  setIsHoveredManual,
}) => {
  const [manualTosses, setManualTosses] = useState<number[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [manualLine, setManualLine] = useState(0);

  // Helper for manual input UI
  const handleManualCoin = (coinIdx: number, value: number) => {
    setManualTosses((prev) => {
      const updated = prev.map((line, idx) =>
        idx === manualLine
          ? [...line.slice(0, coinIdx), value, ...line.slice(coinIdx + 1)]
          : line
      );
      // Update coinTosses in real time for display
      setCoinTosses(updated.filter((line) => line.length > 0));
      return updated;
    });
  };

  const handleManualNextLine = () => {
    if (manualLine < 5) {
      setManualLine(manualLine + 1);
    } else {
      setCoinTosses(manualTosses);
      setIsShowingCanvas(false);
      setTossed(true);
    }
  };

  const handleManualReset = () => {
    setManualTosses([[], [], [], [], [], []]);
    setManualLine(0);
    setCoinTosses([]);
    setTossed(false);
    setIsShowingCanvas(false);
    setManualMode(false);
    setIsHoveredManual(false);
  };

  if (!manualMode) return null;

  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <h3>Manual Coin Toss Input</h3>
      <p>Line {manualLine + 1} of 6</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            value={manualTosses[manualLine][i] ?? ""}
            onChange={(e) => handleManualCoin(i, Number(e.target.value))}
            style={{ fontSize: 18, padding: 4, borderRadius: 6 }}
          >
            <option value="">Coin {i + 1}</option>
            <option value={3}>Heads (3)</option>
            <option value={2}>Tails (2)</option>
          </select>
        ))}
      </div>
      <button
        style={{
          marginTop: 16,
          padding: "4px 16px",
          borderRadius: 8,
          background: BACKGROUND_COLOR,
          color: HOVER_COLOR,
          border: `1px solid ${HOVER_COLOR}`,
          cursor: "pointer",
        }}
        disabled={
          manualTosses[manualLine].length !== 3 ||
          manualTosses[manualLine].some((v) => v !== 2 && v !== 3)
        }
        onClick={handleManualNextLine}
      >
        {manualLine < 5 ? "Next Line" : "Finish"}
      </button>
      <button
        style={{
          marginLeft: 12,
          padding: "4px 16px",
          borderRadius: 8,
          background: BACKGROUND_COLOR,
          color: HOVER_COLOR,
          border: `1px solid ${HOVER_COLOR}`,
          cursor: "pointer",
        }}
        onClick={handleManualReset}
      >
        Exit Manual Input
      </button>
    </div>
  );
};
