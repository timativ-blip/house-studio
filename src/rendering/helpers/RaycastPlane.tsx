import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { snapToGrid } from "@/domain/geometry/snapping";
import { WORLD_CONFIG } from "@/config/world";

/**
 * Невидимая плоскость активного уровня, по которой рассчитывается позиция
 * курсора для будущих инструментов строительства (см. SPEC.md, раздел 13.1:
 * «луч должен пересекать математическую плоскость текущего уровня»).
 * Часть EditorHelpers — не строительная сущность, в проект не сохраняется.
 */
export function RaycastPlane() {
  const setCursorPoint = useProjectStore((s) => s.setCursorPoint);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );
  const { width, depth } = useProjectStore((s) => s.project.siteSize);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const snapped = snapToGrid(
      { x: event.point.x, z: event.point.z },
      WORLD_CONFIG.gridStep,
    );
    setCursorPoint(snapped);
  };

  return (
    <mesh
      position={[0, elevation, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursorPoint(null)}
    >
      <planeGeometry args={[width, depth]} />
      {/* transparent+opacity=0 keeps the mesh raycast-testable while never
          rendering a fragment — unlike `visible={false}`, which some
          three.js raycasting paths skip entirely. */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
