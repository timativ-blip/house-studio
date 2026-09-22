import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { getTextureSet } from "@/rendering/materials/textureSets";
import { useSurfaceTextures } from "@/rendering/materials/useSurfaceTextures";
import type { Floor } from "@/types/project";

/**
 * Пол хранится как многоугольник (SPEC.md, раздел 6.4), но в MVP редактор
 * создаёт только прямоугольные полы — поэтому геометрия строится по
 * ограничивающему прямоугольнику вершин, без универсальной триангуляции.
 * Реальные PBR-текстуры — Poly Haven, CC0 (public/textures/CREDITS.md).
 */
export function FloorMesh({ floor }: { floor: Floor }) {
  const elevation = useProjectStore(
    (s) => s.project.levels[floor.levelId]?.elevation ?? 0,
  );
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);

  const xs = floor.polygon.map((p) => p.x);
  const zs = floor.polygon.map((p) => p.z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const isSelected = selectedRef?.kind === "floor" && selectedRef.id === floor.id;

  const textures = useSurfaceTextures(
    getTextureSet(floor.materialId),
    Math.max(1, width),
    Math.max(1, depth),
  );

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
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        roughness={1}
        metalness={0}
        emissive={isSelected ? "#2bbba8" : "#000000"}
        emissiveIntensity={isSelected ? 0.35 : 0}
      />
    </mesh>
  );
}
