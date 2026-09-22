import { useProjectStore } from "@/application/store/useProjectStore";
import { isValidRectangle, rectangleCorners } from "@/domain/rooms/rectangle";
import { wallGeometryParams } from "@/domain/walls/wallGeometry";
import type { Vec2 } from "@/domain/geometry/vec2";
import { WORLD_CONFIG } from "@/config/world";

/** Предпросмотр четырёх стен будущей комнаты, см. SPEC.md, раздел 7.3, 14.3. */
export function RoomPreview() {
  const draft = useProjectStore((s) => s.draft);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );

  if (!draft || draft.tool !== "room" || !cursorPoint) return null;

  const valid = isValidRectangle(draft.corner, cursorPoint);
  const [p1, p2, p3, p4] = rectangleCorners(draft.corner, cursorPoint);
  const segments: [Vec2, Vec2][] = [
    [p1, p2],
    [p2, p3],
    [p3, p4],
    [p4, p1],
  ];
  const color = valid ? "#2bbba8" : "#e0524f";

  return (
    <>
      {segments.map(([start, end], index) => {
        const { length, angle, center } = wallGeometryParams(start, end);
        if (length < 0.001) return null;
        return (
          <mesh
            key={index}
            position={[center.x, elevation + WORLD_CONFIG.defaultWallHeight / 2, center.z]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry
              args={[length, WORLD_CONFIG.defaultWallHeight, WORLD_CONFIG.defaultWallThickness]}
            />
            <meshStandardMaterial color={color} transparent opacity={0.45} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
}
