// App.tsx
import { useState } from "react";
import { generateHexagram, getTrigrams, findHexagram } from "../utils/iching";

interface Trigram {
  name: string;
}

interface HexagramData {
  name: string;
  number: number;
}

function IChing() {
  const [hexagram, setHexagram] = useState<string>("");
  const [trigrams, setTrigrams] = useState<{
    lower: Trigram;
    upper: Trigram;
  } | null>(null);
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);

  const handleGenerate = () => {
    const newHexagram = generateHexagram();
    setHexagram(newHexagram);
    const trigramsResult = getTrigrams(newHexagram);
    if (trigramsResult.lower && trigramsResult.upper) {
      setTrigrams({
        lower: { name: trigramsResult.lower.name },
        upper: { name: trigramsResult.upper.name },
      });
    } else {
      setTrigrams(null);
    }
    const hexagramResult = findHexagram(newHexagram);
    if (hexagramResult) {
      setHexagramData(hexagramResult);
    } else {
      setHexagramData(null);
    }
  };

  // Function to render the hexagram using SVG
  const renderHexagram = (hexagram: string) => {
    const lineHeight = 10;
    const lineWidth = 100;
    const gap = 5;
    const strokeWidth = 5;

    return (
      <svg width={lineWidth} height={lineHeight * 6 + gap * 5}>
        {hexagram
          .split("")
          .reverse() // Reverse to draw bottom line first
          .map((line, index) => (
            <line
              key={index}
              x1={0}
              y1={index * (lineHeight + gap)}
              x2={lineWidth}
              y2={index * (lineHeight + gap)}
              stroke={line === "1" ? "black" : "transparent"}
              strokeWidth={strokeWidth}
            />
          ))}
        {hexagram
          .split("")
          .reverse() // Reverse to draw bottom line first
          .map((line, index) =>
            line === "0" ? (
              <line
                key={index}
                x1={0}
                y1={index * (lineHeight + gap)}
                x2={lineWidth / 2 - 5}
                y2={index * (lineHeight + gap)}
                stroke="black"
                strokeWidth={strokeWidth}
              />
            ) : null
          )}
        {hexagram
          .split("")
          .reverse() // Reverse to draw bottom line first
          .map((line, index) =>
            line === "0" ? (
              <line
                key={index}
                x1={lineWidth / 2 + 5}
                y1={index * (lineHeight + gap)}
                x2={lineWidth}
                y2={index * (lineHeight + gap)}
                stroke="black"
                strokeWidth={strokeWidth}
              />
            ) : null
          )}
      </svg>
    );
  };

  return (
    <div>
      <h1>I Ching Simulator</h1>
      <button onClick={handleGenerate}>Generate Hexagram</button>
      {hexagram && (
        <div>
          <h2>Hexagram: {hexagram}</h2>
          <div className="hexagram">{renderHexagram(hexagram)}</div>
          <p>Lower Trigram: {trigrams?.lower?.name}</p>
          <p>Upper Trigram: {trigrams?.upper?.name}</p>
          <p>Hexagram Name: {hexagramData?.name}</p>
          <p>Hexagram Number: {hexagramData?.number}</p>
        </div>
      )}
    </div>
  );
}

export default IChing;
