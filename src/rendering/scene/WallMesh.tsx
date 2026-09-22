import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { wallGeometryParams } from "@/domain/walls/wallGeometry";
import { getMaterialById, type MaterialDefinition } from "@/rendering/materials/catalog";
import type { Wall } from "@/types/project";

function faceMaterialProps(material: MaterialDefinition, selected: boolean) {
  return {
    color: material.baseColor,
    roughness: material.roughness,
    metalness: material.metalness,
    emissive: selected ? "#2bbba8" : "#000000",
    emissiveIntensity: selected ? 0.35 : 0,
  } as const;
}

/**
 * Стена как параметрический BoxGeometry: центр и угол — из domain-функции
 * wallGeometryParams (SPEC.md, раздел 7.2). Материалы назначены по группам
 * граней BoxGeometry: +z/-z — большие грани (экстерьер/интерьер, раздел
 * 6.2), торцы и верх/низ переиспользуют материал экстерьера, пока не
 * появятся соединения стен (раздел 7.2, «Соединение стен»).
 */
export function WallMesh({ wall }: { wall: Wall }) {
  const elevation = useProjectStore(
    (s) => s.project.levels[wall.levelId]?.elevation ?? 0,
  );
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);

  const { length, angle, center } = wallGeometryParams(wall.start, wall.end);
  const exterior = getMaterialById(wall.materialId.exterior);
  const interior = getMaterialById(wall.materialId.interior);
  const isSelected = selectedRef?.kind === "wall" && selectedRef.id === wall.id;

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
          {...faceMaterialProps(exterior, isSelected)}
        />
      ))}
      <meshStandardMaterial attach="material-4" {...faceMaterialProps(exterior, isSelected)} />
      <meshStandardMaterial attach="material-5" {...faceMaterialProps(interior, isSelected)} />
    </mesh>
  );
}
