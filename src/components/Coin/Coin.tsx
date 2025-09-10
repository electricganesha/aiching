import { Texture } from "three";

interface CoinProps {
  position: [number, number, number];
  rotation: [number, number, number];
  texture: Texture;
  castShadow?: boolean;
}

export const Coin = ({
  position,
  rotation,
  texture,
  castShadow = true,
}: CoinProps) => {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={false}
    >
      <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};
