"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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

import styles from "./page.module.css";
import Image from "next/image";
import { Button } from "@/components/Button/Button";
const NUMBER_OF_TOSSES = 6;

export default function Home() {
  const { data: session } = useSession();
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
  const [manualMode, setManualMode] = useState(false);

  const [animate, setAnimate] = useState(false);
  const [displayedTosses, setDisplayedTosses] = useState<number[][]>([]);
  const [tossesComplete, setTossesComplete] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);

  // Generate hexagram and reset animation (now for R3F)
  const handleGenerate = useCallback(() => {
    setHexagram("");
    setCoinTosses([]);
    setDisplayedTosses([]);
    setTrigrams(null);
    setHexagramData(null);
    setTossed(true);
    setIsShowingCanvas(true);
    setAnimate(true);
    setTossesComplete(false);
    setHistorySaved(false);

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
  }, []);

  const handleReset = useCallback(() => {
    setHexagram("");
    setCoinTosses([]);
    setDisplayedTosses([]);
    setTrigrams(null);
    setHexagramData(null);
    setTossed(false);
    setIsShowingCanvas(false);
    setAnimate(false);
    setTossesComplete(false);
    setHistorySaved(false);
  }, []);

  // Only calculate hexagram after tossesComplete
  useEffect(() => {
    if (tossesComplete && !historySaved) {
      // Only generate hexagram and save history once per toss
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
      // Save toss history if user is signed in
      if (session?.user) {
        const flatTosses = coinTosses.flat();
        if (flatTosses.length === 21) {
          fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              intention,
              tosses: flatTosses,
              hexagram: hexagramResult?.number,
            }),
          });
        }
      }
      setHistorySaved(true);
    }
  }, [tossesComplete, historySaved, session, coinTosses, intention]);

  const hexagramText: WilhelmHexagram | null = hexagramData
    ? getTranslationKeysForHexagramNumber(hexagramData.number)
    : null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 8 }}>
      <div className={styles.mainLayout}>
        <Intention
          showIntention={!tossed && !manualMode}
          intention={intention}
          setIntention={setIntention}
        />
        <div className={styles.responsiveBtns}>
          {!manualMode && (
            <Button
              disabled={intention === "" || animate}
              onClick={() => {
                if (!tossed) {
                  handleGenerate();
                } else {
                  handleReset();
                }
              }}
            >
              <b>{isShowingCanvas && tossed ? "Toss again" : "Toss coins"}</b>
              <Image
                src="/icons/fengshuicoins.png"
                alt="Toss coins"
                width={20}
                height={20}
              />
            </Button>
          )}
          {!isShowingCanvas && !tossed && !manualMode && (
            <Button
              disabled={intention === ""}
              onClick={() => {
                setManualMode(true);
              }}
            >
              <b>
                {isShowingCanvas && tossed ? "Re-input tosses" : "Input tosses"}
              </b>
              <Image
                src="/icons/fengshuiinput.png"
                alt="Input tosses"
                width={20}
                height={20}
              />
            </Button>
          )}
        </div>
      </div>

      <ManualTossInput
        manualMode={manualMode}
        setCoinTosses={setCoinTosses}
        setTossed={setTossed}
        setDisplayedTosses={setDisplayedTosses}
        setIsShowingCanvas={setIsShowingCanvas}
        setManualMode={setManualMode}
        setTossesComplete={setTossesComplete}
        handleReset={handleReset}
      />

      {isShowingCanvas && !manualMode ? (
        <hr
          style={{
            border: `1px solid var(--shadow)`,
            marginTop: 20,
            marginBottom: 0,
          }}
        ></hr>
      ) : null}
      {!manualMode ? (
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
            {(isShowingCanvas || (coinTosses.length > 0 && !manualMode)) && (
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
      ) : null}
      {isShowingCanvas && !manualMode ? (
        <hr style={{ border: `1px solid var(--shadow)`, margin: "0" }}></hr>
      ) : null}
      <div className={styles.resultsLayout}>
        <div style={{ width: "100%", paddingTop: 8, minWidth: 0 }}>
          {displayedTosses.length > 0 && (
            <TossResults coinTosses={displayedTosses} />
          )}
        </div>
        <div className={styles.hexagramTextContainer}>
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
