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
import { Hero } from "@/components/Hero/Hero";
import { Card } from "@/components/Card/Card";
import { TossMode } from "@/generated/prisma";
import { useAi } from "@/hooks/useAi";
const NUMBER_OF_TOSSES = 6;
const DEFAULT_COIN_STATE = Array(NUMBER_OF_TOSSES).fill([2, 2, 2]);

export default function Home() {
  const { data: session } = useSession();
  const { loading, error, result, getAiResponse } = useAi();

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
  const [intentionTriggered, setIntentionTriggered] = useState(false);
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
    if (tossesComplete && !intentionTriggered) {
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

      if (hexagramResult && intention) {
        getAiResponse(hexagramResult.number, intention);
        setIntentionTriggered(true);
      }
    }
  }, [
    tossesComplete,
    intentionTriggered,
    session,
    coinTosses,
    intention,
    manualMode,
    getAiResponse,
  ]);

  useEffect(() => {
    if (result && !loading && !error && !historySaved) {
      // Save toss history if user is signed in
      if (session?.user) {
        const flatTosses = coinTosses.flat();
        if (flatTosses.length === 21 || flatTosses.length === 18) {
          fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              intention,
              tosses: flatTosses,
              hexagram: hexagramData?.number,
              mode: manualMode ? TossMode.MANUAL : TossMode.AUTOMATIC,
              interpretation: result,
            }),
          });
          setHistorySaved(true);
        }
      }
    }
  }, [
    loading,
    error,
    result,
    coinTosses,
    intention,
    session,
    hexagramData,
    manualMode,
    historySaved,
  ]);

  const hexagramText: WilhelmHexagram | null = hexagramData
    ? getTranslationKeysForHexagramNumber(hexagramData.number)
    : null;

  return (
    <div>
      <Hero />
      <div className={styles.mainLayout} id="main-layout">
        <Card className={styles.intention}>
          <h3
            style={{
              color: "var(--background)",
              textShadow: "0px 0px 2px var(--shadow)",
            }}
          >
            <span>✨</span> Set your intention
          </h3>
          <p>Focus your mind and ask the oracle your question</p>
          <Intention
            showIntention={!tossed && !manualMode}
            intention={intention}
            setIntention={setIntention}
          />
        </Card>
        <div className={styles.actions}>
          <Card className={styles.tossMethod}>
            <h3
              style={{
                color: "var(--background)",
                textShadow: "0px 0px 2px var(--shadow)",
              }}
            >
              <span>🌌</span> Coin oracle
            </h3>
            <p>Choose your method of divination</p>
            <div className={styles.responsiveBtns}>
              <div>
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
                    <b>
                      {isShowingCanvas && tossed ? "Toss again" : "Toss coins"}
                    </b>
                    <Image
                      src="/icons/fengshuicoins.png"
                      alt="Toss coins"
                      width={20}
                      height={20}
                    />
                  </Button>
                )}
                {/* Show Re-input tosses button in manual mode */}
                {manualMode && (
                  <Button
                    disabled={intention === ""}
                    onClick={() => {
                      setManualMode(false);
                    }}
                  >
                    <b>Reset tosses</b>
                    <Image
                      src="/icons/fengshuiinput.png"
                      alt="Reset tosses"
                      width={20}
                      height={20}
                    />
                  </Button>
                )}
              </div>
              {/* Only show 'or' divider when not in manual mode and not tossed */}
              {!manualMode && !tossed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: "164px",
                      border: `1px solid lightgrey`,
                    }}
                  />
                  <span
                    style={{
                      color: "var(--shadow)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    or
                  </span>
                  <div
                    style={{
                      width: "164px",
                      border: `1px solid lightgrey`,
                    }}
                  />
                </div>
              )}
              <div>
                {!isShowingCanvas && !tossed && !manualMode && (
                  <Button
                    disabled={intention === ""}
                    onClick={() => {
                      setManualMode(true);
                    }}
                  >
                    <b>
                      {isShowingCanvas && tossed
                        ? "Re-input tosses"
                        : "Input tosses"}
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
          </Card>
          <Card className={styles.canvas}>
            {!manualMode ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: 460,
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
                  <div
                    style={{
                      width: 460,
                      height: 400,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    <Canvas shadows camera={{ position: [0, 3, 3], fov: 75 }}>
                      <CoinTossCanvas
                        coinTosses={
                          coinTosses.length > 0
                            ? coinTosses
                            : DEFAULT_COIN_STATE
                        }
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
                </div>
              </div>
            ) : (
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
            )}
          </Card>
        </div>
      </div>

      {isShowingCanvas && !manualMode ? (
        <hr
          style={{
            border: `1px solid var(--shadow)`,
            marginTop: 20,
            marginBottom: 0,
          }}
        ></hr>
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
              interpretation={{ loading, error, result }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
