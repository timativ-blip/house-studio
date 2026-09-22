import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { getMaterialById } from "@/rendering/materials/catalog";
import type { Floor } from "@/types/project";

/**
 * Пол хранится как многоугольник (SPEC.md, раздел 6.4), но в MVP редактор
 * создаёт только прямоугольные полы — поэтому геометрия строится по
 * ограничивающему прямоугольнику вершин, без универсальной триангуляции.
 */
export function FloorMesh({ floor }: { floor: Floor }) {
  const elevation = useProjectStore(
    (s) => s.project.levels[floor.levelId]?.elevation ?? 0,
  );
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);
  const material = getMaterialById(floor.materialId);

  const xs = floor.polygon.map((p) => p.x);
  const zs = floor.polygon.map((p) => p.z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const isSelected = selectedRef?.kind === "floor" && selectedRef.id === floor.id;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (activeTool === "select") {
      setSelectedEntity({ kind: "floor", id: floor.id });
    }
  };

  return (
    <mesh
      position={[(minX + maxX) / 2, elevation - floor.thickness / 2, (minZ + maxZ) / 2]}
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={[width, floor.thickness, depth]} />
      <meshStandardMaterial
        color={material.baseColor}
        roughness={material.roughness}
        metalness={material.metalness}
        emissive={isSelected ? "#2bbba8" : "#000000"}
        emissiveIntensity={isSelected ? 0.35 : 0}
      />
    </mesh>
  );
}
