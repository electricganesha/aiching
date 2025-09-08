import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useRef, useState } from "react";
import { Group, Texture, TextureLoader } from "three";
import { Coin } from "./Coin";

interface CoinTossCanvasProps {
  coinTosses: number[][];
  animate: boolean;
  onAnimationEnd: () => void;
  onTossUpdate: (tosses: number[][]) => void;
  headsUrl: string;
  tailsUrl: string;
}

export const CoinTossCanvas: FC<CoinTossCanvasProps> = ({
  coinTosses,
  animate,
  onAnimationEnd,
  onTossUpdate,
  headsUrl,
  tailsUrl,
}) => {
  const group = useRef<Group>(null);
  const [textures, setTextures] = useState<{
    heads: Texture | null;
    tails: Texture | null;
  }>({ heads: null, tails: null });
  const [animState, setAnimState] = useState({
    currentToss: 0,
    currentCoin: 0,
    frame: 0,
    positions: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ] as [number, number, number][],
    velocities: [0.08, 0.08, 0.08],
    directions: [1, 1, 1],
    rotations: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ] as [number, number, number][],
    finished: false,
    showResults: false,
  });

  // Load textures
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(headsUrl, (heads) => {
      loader.load(tailsUrl, (tails) => {
        setTextures({ heads, tails });
      });
    });
  }, [headsUrl, tailsUrl, setTextures]);

  // Reset animation state when animate is triggered
  useEffect(() => {
    if (animate && coinTosses.length) {
      setAnimState({
        currentToss: 0,
        currentCoin: 0,
        frame: 0,
        positions: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        velocities: [0.08, 0.08, 0.08],
        directions: [1, 1, 1],
        rotations: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        finished: false,
        showResults: false,
      });
    }
  }, [animate, coinTosses, setAnimState]);

  // Animation logic for each coin
  useFrame(() => {
    if (!animate || !textures.heads || !textures.tails || animState.finished)
      return;
    const {
      currentToss,
      currentCoin,
      frame,
      positions,
      velocities,
      directions,
      rotations,
      showResults,
    } = animState;

    console.log({
      currentToss,
      currentCoin,
      frame,
      positions,
      velocities,
      directions,
      rotations,
      showResults,
      coinTosses,
    });
    if (currentToss === coinTosses.length - 1) {
      setAnimState((s) => ({ ...s, showResults: true }));
      onAnimationEnd();

      return;
    }
    // Animate current coin
    if (currentCoin < 3) {
      // Up and down motion
      if (directions[currentCoin] === 1) {
        positions[currentCoin][1] += velocities[currentCoin];
        velocities[currentCoin] -= 0.002;
        rotations[currentCoin][0] += 0.2;
        if (velocities[currentCoin] <= 0) {
          directions[currentCoin] = -1;
          velocities[currentCoin] = 0.002;
        }
      } else if (directions[currentCoin] === -1) {
        positions[currentCoin][1] -= velocities[currentCoin];
        velocities[currentCoin] += 0.002;
        rotations[currentCoin][0] += 0.2;
        if (positions[currentCoin][1] <= 0) {
          positions[currentCoin][1] = 0;
          directions[currentCoin] = 0;
        }
      }
      let newFrame = frame + 1;
      let newCurrentCoin = currentCoin;
      if (newFrame === 120 || directions[currentCoin] === 0) {
        // Settle coin to heads/tails, parallel to ground
        rotations[currentCoin][0] = 0;
        rotations[currentCoin][1] = 0;
        rotations[currentCoin][2] = 0;
        // Snap to exact values to avoid floating point drift
        positions[currentCoin][1] = 0;
        newCurrentCoin++;
        newFrame = 0;
      }
      setAnimState({
        currentToss,
        currentCoin: newCurrentCoin,
        frame: newFrame,
        positions: positions.map((p) => [...p] as [number, number, number]),
        velocities: [...velocities],
        directions: [...directions],
        rotations: rotations.map((r) => [...r] as [number, number, number]),
        finished: false,
        showResults,
      });
    } else {
      // Reset for next toss and update parent with new tosses
      setAnimState({
        currentToss: currentToss + 1,
        currentCoin: 0,
        frame: 0,
        positions: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        velocities: [0.08, 0.08, 0.08],
        directions: [1, 1, 1],
        rotations: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        finished: currentToss + 1 >= coinTosses.length,
        showResults,
      });
      // Call onTossUpdate with tosses up to and including this one
      onTossUpdate(coinTosses.slice(0, currentToss + 1));
    }
  });

  // Show coins for current toss
  const coinsToShow =
    animState.currentToss < coinTosses.length
      ? coinTosses[animState.currentToss]
      : [];

  return (
    <group ref={group}>
      {/* Ground plane for shadows */}
      <Plane
        args={[6, 6]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <shadowMaterial attach="material" opacity={0.3} />
      </Plane>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[0, 3, -3]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      {/* Animate coins for current toss */}
      {textures.heads &&
        textures.tails &&
        coinsToShow &&
        coinsToShow.map((coin: number, i: number) => (
          <Coin
            key={i}
            position={[(i - 1) * 1.2, animState.positions[i][1], 0]}
            rotation={animState.rotations[i]}
            texture={coin === 3 ? textures.heads! : textures.tails!}
          />
        ))}
    </group>
  );
};
