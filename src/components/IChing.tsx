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
  const [isHovered, setIsHovered] = useState(false); // State to manage hover
  const mountRef = useRef<HTMLDivElement>(null);
  const animationActiveRef = useRef(true); // Use ref to persist animation state

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
    scene.background = new THREE.Color(0xece2d0);
    const camera = new THREE.PerspectiveCamera(75, 400 / 200, 0.1, 1000);
    camera.position.set(0, 2, 0);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 200);
    mountRef.current.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffff00, 1.0);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    const loader = new THREE.TextureLoader();
    const { headsMaterial, tailsMaterial } = createCoinMaterials(loader);
    const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    let tossIndex = 0;
    const tosses: number[][] = [];

    function tossLine() {
      while (scene.children.length > 0) scene.remove(scene.children[0]);
      scene.add(ambientLight);
      const coins: THREE.Mesh[] = [];
      const axes = [
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
        new THREE.Vector3(Math.random(), 0, Math.random()).normalize(),
      ];
      const velocities = [
        { y: 0.05, rotation: 0.08 + Math.random() * 0.04 },
        { y: 0.05, rotation: 0.08 + Math.random() * 0.04 },
        { y: 0.05, rotation: 0.08 + Math.random() * 0.04 },
      ];
      const directions = [1, 1, 1]; // 1 for upward, -1 for downward
      for (let i = 0; i < 3; i++) {
        const coin = new THREE.Mesh(coinGeometry, headsMaterial);
        coin.position.x = (i - 1) * 1.2;
        coin.position.y = 0;
        scene.add(coin);
        coins.push(coin);
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
              intention === "" ? "darkgrey" : isHovered ? "#7d4a5b" : "#ece2d0",
            borderRadius: "8px",
            border:
              intention === "" ? "1px solid darkgrey" : "1px solid #7d4a5b",
            cursor: intention === "" ? "not-allowed" : "pointer",
            color:
              intention === ""
                ? "lightgray"
                : isHovered
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
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (intention !== "") {
              setIsHovered(false);
            }
          }}
        >
          🪙 <b>{isShowingCanvas ? "Re-Toss" : "Toss"}</b> 🪙
        </button>
      </div>
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
        ref={mountRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
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
