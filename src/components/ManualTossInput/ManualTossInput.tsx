import { FC, useCallback, useState } from "react";

import { Button } from "../Button/Button";

import styles from "./ManualTossInput.module.css";

interface ManualTossInputProps {
  manualMode: boolean;
  setCoinTosses: (tosses: number[][]) => void;
  setTossed: (tossed: boolean) => void;
  setIsShowingCanvas: (show: boolean) => void;
  setManualMode: (mode: boolean) => void;
  setDisplayedTosses: (tosses: number[][]) => void;
  setTossesComplete: (complete: boolean) => void;
  handleReset: () => void;
}

export const ManualTossInput: FC<ManualTossInputProps> = ({
  manualMode,
  setCoinTosses,
  setTossed,
  setIsShowingCanvas,
  setManualMode,
  setDisplayedTosses,
  setTossesComplete,
  handleReset,
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
  const handleManualCoin = useCallback(
    (coinIdx: number, value: number) => {
      setManualTosses((prev) => {
        const updated = prev.map((line, idx) =>
          idx === manualLine
            ? [...line.slice(0, coinIdx), value, ...line.slice(coinIdx + 1)]
            : line
        );

        // Update coinTosses in real time for display
        setDisplayedTosses(updated.filter((line) => line.length > 0));
        setCoinTosses(updated.filter((line) => line.length > 0));
        return updated;
      });
    },
    [manualLine, setCoinTosses, setDisplayedTosses]
  );

  const handleManualNextLine = useCallback(() => {
    if (manualLine < 5) {
      setManualLine(manualLine + 1);
    } else {
      setCoinTosses(manualTosses);
      setDisplayedTosses(manualTosses);
      setIsShowingCanvas(false);
      setTossed(true);
      setTossesComplete(true);
    }
  }, [
    manualLine,
    manualTosses,
    setCoinTosses,
    setIsShowingCanvas,
    setTossed,
    setDisplayedTosses,
    setTossesComplete,
  ]);

  const handleManualPreviousLine = useCallback(() => {
    if (manualLine > 0) {
      setManualLine(manualLine - 1);
    }
  }, [manualLine]);

  const handleManualReset = useCallback(() => {
    setManualTosses([[], [], [], [], [], []]);
    setManualLine(0);
    setManualMode(false);
    handleReset();
  }, [setManualMode, handleReset]);

  if (!manualMode) return null;

  return (
    <div className={styles.manualTossInput}>
      <h3>Manual Coin Toss Input</h3>
      <p>Line {manualLine + 1} of 6</p>
      <div className={styles.coinSelectors}>
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            value={manualTosses[manualLine][i] ?? ""}
            onChange={(e) => handleManualCoin(i, Number(e.target.value))}
            className={styles.coinSelect}
          >
            <option value="">Coin {i + 1}</option>
            <option value={3}>Heads</option>
            <option value={2}>Tails</option>
          </select>
        ))}
      </div>
      <div className={styles.responsiveBtns}>
        {manualLine !== 0 ? (
          <Button
            disabled={manualLine === 0}
            onClick={handleManualPreviousLine}
          >
            Previous Line
          </Button>
        ) : null}
        <Button
          disabled={
            manualTosses[manualLine].length !== 3 ||
            manualTosses[manualLine].some((v) => v !== 2 && v !== 3)
          }
          onClick={handleManualNextLine}
        >
          {manualLine < 5 ? <b>Next Line</b> : <b>Finish</b>}
        </Button>

        <Button onClick={handleManualReset}>
          {manualLine < 5 ? <b>Exit Manual Input</b> : <b>Exit and reset</b>}
        </Button>
      </div>
    </div>
  );
};
