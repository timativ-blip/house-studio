import { useProjectStore } from "@/application/store/useProjectStore";
import { isValidWallLength, wallGeometryParams } from "@/domain/walls/wallGeometry";
import { WORLD_CONFIG } from "@/config/world";

/**
 * Предпросмотр стены во время строительства: бирюзовый — допустимая длина,
 * красный — недопустимая (SPEC.md, раздел 14.3). Не записывается в проект,
 * пока пользователь не подтвердит вторым кликом.
 */
export function WallPreview() {
  const draft = useProjectStore((s) => s.draft);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );

  if (!draft || draft.tool !== "wall" || !cursorPoint) return null;

  const { length, angle, center } = wallGeometryParams(draft.start, cursorPoint);
  if (length < 0.001) return null;

  const valid = isValidWallLength(draft.start, cursorPoint);

  return (
    <mesh
      position={[center.x, elevation + WORLD_CONFIG.defaultWallHeight / 2, center.z]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, WORLD_CONFIG.defaultWallHeight, WORLD_CONFIG.defaultWallThickness]} />
      <meshStandardMaterial
        color={valid ? "#2bbba8" : "#e0524f"}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}
