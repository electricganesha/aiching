"use client";

import { useEffect, useState } from "react";
import { HexagramData, Trigram } from "@/types/hexagram";
import { WilhelmHexagram } from "@/types/wilhelm";
import {
  findHexagram,
  generateHexagram,
  getTranslationKeysForHexagramNumber,
  getTrigrams,
} from "@/utils/iching";
import { Intention } from "@/components/Intention/Intention";
import { ManualTossInput } from "@/components/ManualTossInput/ManualTossInput";
import { TossResults } from "@/components/TossResults/TossResults";
import { Canvas } from "@react-three/fiber";
import { CoinTossCanvas } from "@/components/CoinTossCanvas/CoinTossCanvas";
import { HexagramText } from "@/components/HexagramText/HexagramText";

const NUMBER_OF_TOSSES = 6;

export default function Home() {
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
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 8 }}>
      <div
        className="responsive-flex"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Intention
          showIntention={!tossed && !manualMode}
          intention={intention}
          setIntention={setIntention}
        />
        <div
          className="responsive-btns"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
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
                    ? "var(--highlight)"
                    : "var(--secondary)",
                borderRadius: "8px",
                border:
                  intention === ""
                    ? `1px solid darkgrey`
                    : `1px solid var(--primary)`,
                cursor: intention === "" ? "not-allowed" : "pointer",
                color:
                  intention === ""
                    ? "lightgray"
                    : isHoveredToss
                    ? "var(--background)"
                    : "var(--primary)",
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
                    ? "var(--highlight)"
                    : "var(--secondary)",
                borderRadius: "8px",
                border:
                  intention === ""
                    ? `1px solid darkgrey`
                    : `1px solid var(--primary)`,
                cursor: intention === "" ? "not-allowed" : "pointer",
                color:
                  intention === ""
                    ? "lightgray"
                    : isHoveredManual
                    ? "var(--background)"
                    : "var(--primary)",
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
            border: `1px solid var(--shadow)`,
            marginTop: 20,
            marginBottom: 0,
          }}
        ></hr>
      ) : null}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "relative",
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
        <hr style={{ border: `1px solid var(--shadow)`, margin: "0" }}></hr>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "stretch",
          gap: 24,
        }}
      >
        <div style={{ width: "100%", paddingTop: 8, minWidth: 0 }}>
          {displayedTosses.length > 0 && (
            <TossResults coinTosses={displayedTosses} />
          )}
        </div>
        <div
          style={{
            width: "100%",
            borderLeft:
              (isShowingCanvas || coinTosses.length > 0) && tossesComplete
                ? `1px solid var(--shadow)`
                : "none",
            paddingLeft: 0,
            paddingTop: 8,
            minWidth: 0,
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
}
