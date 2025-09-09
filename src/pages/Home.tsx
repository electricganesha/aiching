import { useEffect, useState } from "react";
import {
  findHexagram,
  generateHexagram,
  getTranslationKeysForHexagramNumber,
  getTrigrams,
} from "../utils/iching";
import { WilhelmHexagram } from "../types/wilhelm";

import { Canvas } from "@react-three/fiber";
import { ManualTossInput } from "../components/ManualTossInput";
import { HexagramText } from "../components/HexagramText";
import { TossResults } from "../components/TossResults";
import { CoinTossCanvas } from "../components/CoinTossCanvas";
import { Intention } from "../components/Intention";

interface Trigram {
  name: string;
}
interface HexagramData {
  name: string;
  number: number;
}

const NUMBER_OF_TOSSES = 6;
export const BACKGROUND_COLOR = "#fffaf0";
export const BORDER_COLOR = "#f2eada";
export const HOVER_COLOR = "#7d4a5b";

const Home = () => {
  const [hexagram, setHexagram] = useState<string>("");
  const [coinTosses, setCoinTosses] = useState<number[][]>([]);
  const [isShowingCanvas, setIsShowingCanvas] = useState(false);
  const [intention, setIntention] = useState("");
  const [tossed, setTossed] = useState(false);
  const [trigrams, setTrigrams] = useState<{
    lower: Trigram;
    upper: Trigram;
  } | null>(null);
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const [isHoveredToss, setIsHoveredToss] = useState(false);
  const [isHoveredManual, setIsHoveredManual] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const [animate, setAnimate] = useState(false);
  const [displayedTosses, setDisplayedTosses] = useState<number[][]>([]);
  const [tossesComplete, setTossesComplete] = useState(false);

  // Generate hexagram and reset animation (now for R3F)
  const handleGenerate = () => {
    setHexagram("");
    setCoinTosses([]);
    setDisplayedTosses([]);
    setTrigrams(null);
    setHexagramData(null);
    setTossed(true);
    setIsShowingCanvas(true);
    setAnimate(true);
    setTossesComplete(false);
    // Simulate tosses for demo: you can animate this with state for each toss
    const tosses: number[][] = [];
    for (let i = 0; i <= NUMBER_OF_TOSSES; i++) {
      tosses.push([
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
        Math.random() > 0.5 ? 3 : 2,
      ]);
    }
    setCoinTosses(tosses);
  };

  // Only calculate hexagram after tossesComplete
  useEffect(() => {
    if (tossesComplete) {
      const { hexagram: newHexagram } = generateHexagram();
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
      setHexagramData(hexagramResult || null);
    }
  }, [tossesComplete, displayedTosses]);

  const hexagramText: WilhelmHexagram | null = hexagramData
    ? getTranslationKeysForHexagramNumber(hexagramData.number)
    : null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginLeft: 24,
        }}
      >
        <Intention
          showIntention={!tossed && !manualMode}
          intention={intention}
          setIntention={setIntention}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 16,
          }}
        >
          {!manualMode && (
            <button
              disabled={intention === ""}
              style={{
                backgroundColor:
                  intention === ""
                    ? "darkgrey"
                    : isHoveredToss
                    ? HOVER_COLOR
                    : BORDER_COLOR,
                borderRadius: "8px",
                border:
                  intention === ""
                    ? `1px solid darkgrey`
                    : `1px solid ${HOVER_COLOR}`,
                cursor: intention === "" ? "not-allowed" : "pointer",
                color:
                  intention === ""
                    ? "lightgray"
                    : isHoveredToss
                    ? BACKGROUND_COLOR
                    : HOVER_COLOR,
              }}
              onClick={() => {
                if (!tossed) {
                  handleGenerate();
                } else {
                  setTossed(false);
                }
              }}
              onMouseEnter={() => {
                if (intention !== "") {
                  setIsHoveredToss(true);
                }
              }}
              onMouseLeave={() => {
                if (intention !== "") {
                  setIsHoveredToss(false);
                }
              }}
            >
              <b>{isShowingCanvas ? "Re-Toss" : "Auto Toss"}</b> 🪙
            </button>
          )}
          {!isShowingCanvas && !tossed && !manualMode && (
            <button
              disabled={intention === ""}
              style={{
                backgroundColor:
                  intention === ""
                    ? "darkgrey"
                    : isHoveredManual
                    ? HOVER_COLOR
                    : BORDER_COLOR,
                borderRadius: "8px",
                border:
                  intention === ""
                    ? `1px solid darkgrey`
                    : `1px solid ${HOVER_COLOR}`,
                cursor: intention === "" ? "not-allowed" : "pointer",
                color:
                  intention === ""
                    ? "lightgray"
                    : isHoveredManual
                    ? BACKGROUND_COLOR
                    : HOVER_COLOR,
              }}
              onClick={() => {
                setManualMode(true);
              }}
              onMouseEnter={() => {
                if (intention !== "") {
                  setIsHoveredManual(true);
                }
              }}
              onMouseLeave={() => {
                if (intention !== "") {
                  setIsHoveredManual(false);
                }
              }}
            >
              <b>Manual Toss</b> 🪙
            </button>
          )}
        </div>
      </div>

      <ManualTossInput
        manualMode={manualMode}
        setCoinTosses={setCoinTosses}
        setTossed={setTossed}
        setIsShowingCanvas={setIsShowingCanvas}
        setManualMode={setManualMode}
        setIsHoveredManual={setIsHoveredManual}
      />

      {isShowingCanvas ? (
        <hr
          style={{
            border: `1px solid ${BORDER_COLOR}`,
            marginTop: 20,
            marginBottom: 0,
          }}
        ></hr>
      ) : null}
      <div
        style={{
          width: "400px",
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 0,
            width: "100%",
            height: 200,
            pointerEvents: "none",
            zIndex: 10,
            margin: "20px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {(isShowingCanvas || coinTosses.length > 0) && (
            <div
              style={{
                width: 800,
                height: 400,
                position: "relative",
                zIndex: 10,
              }}
            >
              <Canvas shadows camera={{ position: [0, 3, 3], fov: 75 }}>
                <CoinTossCanvas
                  coinTosses={coinTosses}
                  animate={animate}
                  onAnimationEnd={() => {
                    setAnimate(false);
                    setTossesComplete(true);
                  }}
                  onTossUpdate={setDisplayedTosses}
                  headsUrl="/icons/fengshuicoinheads-icon.png"
                  tailsUrl="/icons/fengshuicointails-icon.png"
                />
              </Canvas>
            </div>
          )}
        </div>
      </div>
      {isShowingCanvas ? (
        <hr style={{ border: `1px solid ${BORDER_COLOR}`, margin: "0" }}></hr>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "50%", paddingTop: 48 }}>
          {displayedTosses.length > 0 && (
            <TossResults coinTosses={displayedTosses} />
          )}
        </div>
        <div
          style={{
            width: "50%",
            borderLeft:
              (isShowingCanvas || coinTosses.length > 0) && tossesComplete
                ? `1px solid ${BORDER_COLOR}`
                : "none",
            paddingLeft: 128,
            paddingTop: 48,
          }}
        >
          {tossesComplete && hexagram && (
            <HexagramText
              hexagram={hexagram}
              trigrams={trigrams}
              hexagramData={hexagramData}
              hexagramText={hexagramText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
