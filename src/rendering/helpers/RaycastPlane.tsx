import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { resolveSnapPoint } from "@/domain/geometry/snapping";
import type { Vec2 } from "@/domain/geometry/vec2";
import { WORLD_CONFIG } from "@/config/world";

/**
 * Невидимая плоскость активного уровня, по которой рассчитывается позиция
 * курсора для инструментов строительства (SPEC.md, раздел 13.1: «луч должен
 * пересекать математическую плоскость текущего уровня»). Привязка сначала
 * пытается зацепиться за концы существующих стен, затем — за сетку
 * (раздел 5.2). Часть EditorHelpers — не строительная сущность.
 */
export function RaycastPlane() {
  const setCursorPoint = useProjectStore((s) => s.setCursorPoint);
  const handlePlaneClick = useProjectStore((s) => s.handlePlaneClick);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );
  const { width, depth } = useProjectStore((s) => s.project.siteSize);
  const walls = useProjectStore((s) => s.project.entities.walls);

  const existingPoints = useMemo(() => {
    const points: Vec2[] = [];
    for (const wall of Object.values(walls)) {
      points.push(wall.start, wall.end);
    }
    return points;
  }, [walls]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const snapped = resolveSnapPoint(
      { x: event.point.x, z: event.point.z },
      {
        gridStep: WORLD_CONFIG.gridStep,
        snapTolerance: WORLD_CONFIG.snapTolerance,
        existingPoints,
      },
    );
    setCursorPoint(snapped);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.point) {
      const snapped = resolveSnapPoint(
        { x: event.point.x, z: event.point.z },
        {
          gridStep: WORLD_CONFIG.gridStep,
          snapTolerance: WORLD_CONFIG.snapTolerance,
          existingPoints,
        },
      );
      handlePlaneClick(snapped);
    }
  };

  return (
    <mesh
      position={[0, elevation, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursorPoint(null)}
      onClick={handleClick}
    >
      <planeGeometry args={[width, depth]} />
      {/* transparent+opacity=0 keeps the mesh raycast-testable while never
          rendering a fragment — unlike `visible={false}`, which some
          three.js raycasting paths skip entirely. */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
