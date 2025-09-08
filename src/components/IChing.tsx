import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import {
  findHexagram,
  generateHexagram,
  getTranslationKeysForHexagramNumber,
  getTrigrams,
} from "../utils/iching";
import { WilhelmHexagram } from "../types/wilhelm";
import { TossResults } from "./TossResults";
import { HexagramText } from "./HexagramText";

interface Trigram {
  name: string;
}
interface HexagramData {
  name: string;
  number: number;
}

const createCoinMaterials = (loader: THREE.TextureLoader) => {
  const headsTexture = loader.load("/icons/fengshuicoinheads-icon.png");
  const tailsTexture = loader.load("/icons/fengshuicointails-icon.png");
  return {
    headsMaterial: new THREE.MeshStandardMaterial({
      map: headsTexture,
      transparent: true,
    }),
    tailsMaterial: new THREE.MeshStandardMaterial({
      map: tailsTexture,
      transparent: true,
    }),
  };
};

const IChing = () => {
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
  const mountRef = useRef<HTMLDivElement>(null);
  const animationActiveRef = useRef(true); // Use ref to persist animation state
  const [manualMode, setManualMode] = useState(false);
  const [manualTosses, setManualTosses] = useState<number[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [manualLine, setManualLine] = useState(0);

  // Generate hexagram and reset animation
  const handleGenerate = () => {
    setHexagram("");
    setCoinTosses([]);
    setTrigrams(null);
    setHexagramData(null);
    animationActiveRef.current = true; // Reset animation state
    setTossed(true);

    if (!mountRef.current) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    setIsShowingCanvas(true);
    const scene = new THREE.Scene();
    scene.background = null; // transparent background
    const camera = new THREE.PerspectiveCamera(75, 400 / 200, 0.1, 1000);
    camera.position.set(0, 3, 2); // Lower and move camera back
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(800, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xece2d0, 0.5); // lower intensity for visible shadows
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xece2d0, 1.0);
    directionalLight.position.set(0, 1.5, -1); // Move light higher and forward
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 20;
    scene.add(directionalLight);
    // Add ground plane to receive shadows (debug: visible ground)
    const groundGeometry = new THREE.PlaneGeometry(6, 6);
    const groundMaterial = new THREE.ShadowMaterial({
      opacity: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    const loader = new THREE.TextureLoader();
    const { headsMaterial, tailsMaterial } = createCoinMaterials(loader);
    const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    let tossIndex = 0;
    const tosses: number[][] = [];
    let coinMeshes: THREE.Mesh[] = [];

    function tossLine() {
      // Remove only coins from the scene
      for (const mesh of coinMeshes) {
        scene.remove(mesh);
      }
      coinMeshes = [];
      const coins: THREE.Mesh[] = [];
      const axes = [
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
      ];
      const velocities = [
        { y: 0.08, rotation: 0.08 + Math.random() * 0.04 },
        { y: 0.08, rotation: 0.08 + Math.random() * 0.04 },
        { y: 0.08, rotation: 0.08 + Math.random() * 0.04 },
      ];
      const directions = [1, 1, 1]; // 1 for upward, -1 for downward
      for (let i = 0; i < 3; i++) {
        const coin = new THREE.Mesh(coinGeometry, headsMaterial);
        coin.position.x = (i - 1) * 1.2;
        coin.position.y = 0; // slightly above ground for visible shadow
        coin.castShadow = true;
        coin.receiveShadow = false;
        scene.add(coin);
        coins.push(coin);
        coinMeshes.push(coin);
        directionalLight.lookAt(coin.position);
      }
      let currentCoin = 0;
      let frame = 0;
      const tossResults: number[] = [0, 0, 0];
      function animate() {
        if (currentCoin < coins.length) {
          const coin = coins[currentCoin];
          const velocity = velocities[currentCoin];

          // Simulate a single upward and downward motion
          if (directions[currentCoin] === 1) {
            coin.position.y += velocity.y; // Move up
            velocity.y -= 0.002; // Gradually decrease upward velocity
            if (velocity.y <= 0) {
              directions[currentCoin] = -1; // Switch to downward motion
              velocity.y = 0.002; // Reset velocity for downward motion
            }
          } else {
            coin.position.y -= velocity.y; // Move down
            velocity.y += 0.002; // Gradually increase downward velocity
            if (coin.position.y <= 0) {
              coin.position.y = 0; // Ensure it doesn't go below 0
              directions[currentCoin] = 0; // Stop further motion
            }
          }

          // Apply rotation
          coin.rotateOnAxis(axes[currentCoin], velocity.rotation);

          frame++;
          if (frame > 240 || directions[currentCoin] === 0) {
            // Stop animation after motion completes
            const isHeads = Math.random() > 0.5;
            coin.rotation.set(0, 0, 0);
            coin.rotation.x = isHeads ? 0 : Math.PI;
            coin.rotation.y = 0;
            coin.material = isHeads ? headsMaterial : tailsMaterial;
            tossResults[currentCoin] = isHeads ? 3 : 2;
            currentCoin++;
            frame = 0;
          }
          renderer.render(scene, camera);
          console.log("Rendering frame", frame, "coin y:", coin.position.y);
          requestAnimationFrame(animate);
        } else {
          tosses.push([...tossResults]);
          setCoinTosses((prev) => [...prev, [...tossResults]]); // Update coin tosses iteratively
          tossIndex++;

          if (tossIndex < 6) {
            setTimeout(tossLine, 500);
          } else {
            setTimeout(() => {
              animationActiveRef.current = false; // Mark animation as complete
              renderer.render(scene, camera); // Final render to keep the canvas visible
            }, 500);
          }
        }
      }
      animate();
    }
    tossLine();
  };

  // When coinTosses updates, calculate hexagram and trigrams
  useEffect(() => {
    if (coinTosses.length === 6) {
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
  }, [coinTosses]);

  const hexagramText: WilhelmHexagram | null = hexagramData
    ? getTranslationKeysForHexagramNumber(hexagramData.number)
    : null;

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
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          border: "1px solid #7d4a5b",
          backgroundColor: "#7d4a5b",
          color: "#ece2d0",
          width: "480px",
          margin: "0 auto",
          padding: "8px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          zIndex: -1,
        }}
      >
        ☯&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I Ching |
        易經&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;☯
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        {!tossed ? (
          <textarea
            rows={2}
            cols={48}
            placeholder="E.g. What should I do today?"
            style={{
              resize: "none",
              padding: 8,
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #7d4a5b",
              color: "#7d4a5b",
              textAlign: "center",
              verticalAlign: "middle",
            }}
            onInput={(e) =>
              setIntention((e.target as HTMLTextAreaElement).value)
            }
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.border = "1px solid #7d4a5b";
              e.target.style.backgroundColor = "#7d4a5b";
              e.target.style.color = "#ece2d0";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #7d4a5b";
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#7d4a5b";
            }}
          ></textarea>
        ) : (
          <p>{intention}</p>
        )}
        <button
          disabled={intention === ""}
          style={{
            backgroundColor:
              intention === ""
                ? "darkgrey"
                : isHoveredToss
                ? "#7d4a5b"
                : "#ece2d0",
            borderRadius: "8px",
            border:
              intention === "" ? "1px solid darkgrey" : "1px solid #7d4a5b",
            cursor: intention === "" ? "not-allowed" : "pointer",
            color:
              intention === ""
                ? "lightgray"
                : isHoveredToss
                ? "#ece2d0"
                : "#7d4a5b",
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
        <button
          disabled={intention === ""}
          style={{
            backgroundColor:
              intention === ""
                ? "darkgrey"
                : isHoveredManual
                ? "#7d4a5b"
                : "#ece2d0",
            borderRadius: "8px",
            border:
              intention === "" ? "1px solid darkgrey" : "1px solid #7d4a5b",
            cursor: intention === "" ? "not-allowed" : "pointer",
            color:
              intention === ""
                ? "lightgray"
                : isHoveredManual
                ? "#ece2d0"
                : "#7d4a5b",
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
          <b>{isShowingCanvas ? "Re-Input" : "Manual Toss"}</b> 🪙
        </button>
      </div>

      {manualMode ? (
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
              background: "#ece2d0",
              color: "#7d4a5b",
              border: "1px solid #7d4a5b",
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
              background: "#ece2d0",
              color: "#7d4a5b",
              border: "1px solid #7d4a5b",
              cursor: "pointer",
            }}
            onClick={handleManualReset}
          >
            Reset Manual Input
          </button>
        </div>
      ) : null}
      {isShowingCanvas ? (
        <hr
          style={{
            border: "1px solid #a79e91",
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
          ref={mountRef}
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
        />
      </div>
      {isShowingCanvas ? (
        <hr style={{ border: "1px solid #a79e91", margin: "0" }}></hr>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "50%", paddingTop: 48 }}>
          {coinTosses.length > 0 && <TossResults coinTosses={coinTosses} />}
        </div>
        <div
          style={{
            width: "50%",
            borderLeft:
              isShowingCanvas && coinTosses.length === 6
                ? "1px solid #a79e91"
                : "none",
            paddingLeft: 128,
            paddingTop: 48,
          }}
        >
          {hexagram && (
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

export default IChing;
