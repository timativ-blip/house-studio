import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { wallGeometryParams } from "@/domain/walls/wallGeometry";
import { getMaterialById } from "@/rendering/materials/catalog";
import type { Path } from "@/types/project";

const PATH_THICKNESS = 0.05;

/**
 * Дорожка — тот же приём «отрезок → плоский параллелепипед», что и у стены
 * (см. wallGeometry, раздел 7.2), просто низкая и широкая. MVP — один
 * прямой сегмент (раздел 11.2).
 */
export function PathMesh({ path }: { path: Path }) {
  const elevation = useProjectStore(
    (s) => s.project.levels[path.levelId]?.elevation ?? 0,
  );
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);

  const [start, end] = path.segments;
  const { length, angle, center } = wallGeometryParams(start, end);
  const material = getMaterialById(path.materialId);
  const isSelected = selectedRef?.kind === "path" && selectedRef.id === path.id;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (activeTool === "select") {
      setSelectedEntity({ kind: "path", id: path.id });
    }
  };

  return (
    <mesh
      position={[center.x, elevation + PATH_THICKNESS / 2, center.z]}
      rotation={[0, -angle, 0]}
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={[length, PATH_THICKNESS, path.width]} />
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
