import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { wallGeometryParams } from "@/domain/walls/wallGeometry";
import { getTextureSet } from "@/rendering/materials/textureSets";
import { useSurfaceTextures, type SurfaceTextures } from "@/rendering/materials/useSurfaceTextures";
import type { Wall } from "@/types/project";

function faceMaterialProps(textures: SurfaceTextures, selected: boolean) {
  return {
    map: textures.map,
    normalMap: textures.normalMap,
    roughnessMap: textures.roughnessMap,
    roughness: 1,
    metalness: 0,
    emissive: selected ? "#2bbba8" : "#000000",
    emissiveIntensity: selected ? 0.35 : 0,
  } as const;
}

/**
 * Стена как параметрический BoxGeometry: центр и угол — из domain-функции
 * wallGeometryParams (SPEC.md, раздел 7.2). Материалы назначены по группам
 * граней BoxGeometry: +z/-z — большие грани (экстерьер/интерьер, раздел
 * 6.2), торцы и верх/низ переиспользуют материал экстерьера, пока не
 * появятся соединения стен (раздел 7.2, «Соединение стен»). Реальные
 * PBR-текстуры — Poly Haven, CC0 (public/textures/CREDITS.md).
 */
export function WallMesh({ wall }: { wall: Wall }) {
  const elevation = useProjectStore(
    (s) => s.project.levels[wall.levelId]?.elevation ?? 0,
  );
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);

  const { length, angle, center } = wallGeometryParams(wall.start, wall.end);
  const isSelected = selectedRef?.kind === "wall" && selectedRef.id === wall.id;

  const repeatX = Math.max(1, length);
  const repeatY = Math.max(1, wall.height);
  const exteriorTextures = useSurfaceTextures(
    getTextureSet(wall.materialId.exterior),
    repeatX,
    repeatY,
  );
  const interiorTextures = useSurfaceTextures(
    getTextureSet(wall.materialId.interior),
    repeatX,
    repeatY,
  );

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (activeTool === "select") {
      setSelectedEntity({ kind: "wall", id: wall.id });
    }
  };

  return (
    <mesh
      position={[center.x, elevation + wall.height / 2, center.z]}
      rotation={[0, -angle, 0]}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={[length, wall.height, wall.thickness]} />
      {[0, 1, 2, 3].map((i) => (
        <meshStandardMaterial
          key={i}
          attach={`material-${i}`}
          {...faceMaterialProps(exteriorTextures, isSelected)}
        />
      ))}
      <meshStandardMaterial
        attach="material-4"
        {...faceMaterialProps(exteriorTextures, isSelected)}
      />
      <meshStandardMaterial
        attach="material-5"
        {...faceMaterialProps(interiorTextures, isSelected)}
      />
    </mesh>
  );
}
