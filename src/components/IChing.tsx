import { useState, useEffect } from "react";
import {
  generateHexagram,
  getTrigrams,
  findHexagram,
  getTranslationKeysForHexagramNumber,
} from "../utils/iching";
import { WilhelmHexagram } from "../types/wilhelm";

interface Trigram {
  name: string;
}

interface HexagramData {
  name: string;
  number: number;
}

function IChing() {
  const [hexagram, setHexagram] = useState<string>("");
  const [coinTosses, setCoinTosses] = useState<number[][]>([]);
  const [trigrams, setTrigrams] = useState<{
    lower: Trigram;
    upper: Trigram;
  } | null>(null);
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(0);

  const handleGenerate = () => {
    const { hexagram: newHexagram, coinTosses: newCoinTosses } =
      generateHexagram();
    setHexagram(newHexagram);
    setCoinTosses(newCoinTosses);
    setAnimationStep(0); // Reset animation step
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

  useEffect(() => {
    if (animationStep < coinTosses.length) {
      const timer = setTimeout(() => {
        setAnimationStep((prev) => prev + 1);
      }, 500); // Adjust the delay as needed
      return () => clearTimeout(timer);
    }
  }, [animationStep, coinTosses.length]);

  const hexagramText: WilhelmHexagram | null = hexagramData
    ? getTranslationKeysForHexagramNumber(hexagramData.number)
    : null;

  // Function to render the hexagram using SVG
  const renderHexagram = (hexagram: string, step: number) => {
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
              style={{ opacity: step > index ? 1 : 0 }}
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
                style={{ opacity: step > index ? 1 : 0 }}
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
                style={{ opacity: step > index ? 1 : 0 }}
              />
            ) : null
          )}
      </svg>
    );
  };

  return (
    <div>
      <h1>
        ☯&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i-Ching&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;☯
      </h1>
      <button onClick={handleGenerate}>◯ Toss Coins ◯</button>
      {hexagram && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              textAlign: "center",
              paddingRight: "20px",
              width: "50%",
            }}
          >
            <h3>Coin Tosses:</h3>
            {coinTosses.map((toss, index) => (
              <div
                key={index}
                style={{ opacity: animationStep > index ? 1 : 0 }}
              >
                <p>
                  Line {index + 1}: {toss.join(", ")} (Total:{" "}
                  {toss.reduce((sum, coin) => sum + coin, 0)})
                </p>
                <div>
                  {toss.map((coin, coinIndex) => (
                    <img
                      key={coinIndex}
                      src={
                        coin === 3
                          ? "/icons/fengshuicoinheads-icon.png"
                          : "/icons/fengshuicointails-icon.png"
                      }
                      alt={coin === 3 ? "Heads" : "Tails"}
                      style={{
                        width: "60px",
                        height: "60px",
                        padding: "4px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              paddingLeft: "80px",
              borderLeft: "1px solid black",
              marginBottom: "20px",
              borderBottom: "1px dashed black",
              width: "45%",
            }}
          >
            <h2>Hexagram: {hexagram}</h2>
            <div className="hexagram">
              {renderHexagram(hexagram, animationStep)}
            </div>
            {animationStep >= coinTosses.length && (
              <>
                <p>Lower Trigram: {trigrams?.lower?.name}</p>
                <p>Upper Trigram: {trigrams?.upper?.name}</p>
                <p>Hexagram Name: {hexagramData?.name}</p>
                <hr></hr>
                <u>Symbolism</u>
                <p>Hexagram Number: {hexagramData?.number}</p>
                <p>: {hexagramText?.wilhelm_symbolic}</p>
                <hr></hr>
                <u>Judgment </u>
                <p>
                  <b>Original Text:</b> {hexagramText?.wilhelm_judgment.text}
                </p>
                <p>
                  <b>Comments:</b> {hexagramText?.wilhelm_judgment.comments}
                </p>
                <hr></hr>
                <u>Image </u>
                <p>
                  <b>Original Text:</b> {hexagramText?.wilhelm_image.text}
                </p>
                <p>
                  <b>Comments:</b> {hexagramText?.wilhelm_image.comments}
                </p>
                <hr></hr>
                <u>Lines </u>
                {hexagramText &&
                  Object.entries(hexagramText.wilhelm_lines).map(
                    ([_index, line]) => (
                      <div key={_index}>
                        <p>
                          <b>Original Text:</b> {line.text}
                        </p>
                        <p>
                          <b>Comments:</b> {line.comments}
                        </p>
                      </div>
                    )
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IChing;
