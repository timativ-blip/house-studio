/**
 * Процедурные геометрические заглушки для каталога предметов (SPEC.md,
 * раздел 10.1: «В первой версии допустимо использовать процедурные
 * геометрические заглушки вместо полноценных GLB-моделей»). Каждый предмет
 * собран из нескольких примитивов; точка привязки — центр основания (y=0).
 */

const WOOD = "#8a5a3a";
const FABRIC = "#7c8a99";
const TRUNK = "#6b4a33";
const LEAVES_ROUND = "#4c8c52";
const LEAVES_CONICAL = "#3a6b45";
const BUSH = "#5a9a5f";

function Sofa() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.4, 0.85]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, -0.35]} castShadow>
        <boxGeometry args={[1.8, 0.4, 0.15]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </mesh>
      <mesh position={[-0.8, 0.35, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.85]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </mesh>
      <mesh position={[0.8, 0.35, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.85]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Table() {
  const legPositions: [number, number][] = [
    [-0.55, -0.35],
    [0.55, -0.35],
    [-0.55, 0.35],
    [0.55, 0.35],
  ];
  return (
    <group>
      <mesh position={[0, 0.725, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Chair() {
  const legPositions: [number, number][] = [
    [-0.2, -0.2],
    [0.2, -0.2],
    [-0.2, 0.2],
    [0.2, 0.2],
  ];
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.5, 0.05]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.225, z]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Bed() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.3, 2.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.2, 1.9]} />
        <meshStandardMaterial color="#e8e2d5" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, -0.75]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TreeRound() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.2, 8]} />
        <meshStandardMaterial color={TRUNK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[1.1, 12, 10]} />
        <meshStandardMaterial color={LEAVES_ROUND} roughness={0.9} />
      </mesh>
    </group>
  );
}

function TreeConical() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.0, 8]} />
        <meshStandardMaterial color={TRUNK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.9, 3, 10]} />
        <meshStandardMaterial color={LEAVES_CONICAL} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Bush() {
  return (
    <mesh position={[0, 0.35, 0]} castShadow>
      <icosahedronGeometry args={[0.45, 1]} />
      <meshStandardMaterial color={BUSH} roughness={0.95} />
    </mesh>
  );
}

const GEOMETRY_BY_ASSET_ID: Record<string, () => React.JSX.Element> = {
  sofa: Sofa,
  table: Table,
  chair: Chair,
  bed: Bed,
  "tree-round": TreeRound,
  "tree-conical": TreeConical,
  bush: Bush,
};

export function ItemGeometry({ assetId }: { assetId: string }) {
  const Component = GEOMETRY_BY_ASSET_ID[assetId];
  if (!Component) return null;
  return <Component />;
}
