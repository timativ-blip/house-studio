import { useProjectStore } from "@/application/store/useProjectStore";
import { isValidWallLength, wallGeometryParams } from "@/domain/walls/wallGeometry";
import { WORLD_CONFIG } from "@/config/world";

const PATH_PREVIEW_THICKNESS = 0.05;

/** Предпросмотр дорожки при построении (SPEC.md, раздел 11.2, 14.3). */
export function PathPreview() {
  const draft = useProjectStore((s) => s.draft);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );

  if (!draft || draft.tool !== "path" || !cursorPoint) return null;

  const { length, angle, center } = wallGeometryParams(draft.start, cursorPoint);
  if (length < 0.001) return null;

  const valid = isValidWallLength(draft.start, cursorPoint);

  return (
    <mesh
      position={[center.x, elevation + PATH_PREVIEW_THICKNESS / 2, center.z]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, PATH_PREVIEW_THICKNESS, WORLD_CONFIG.defaultPathWidth]} />
      <meshStandardMaterial
        color={valid ? "#2bbba8" : "#e0524f"}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}
