import { useProjectStore } from "@/application/store/useProjectStore";

/**
 * Визуальный маркер точки привязки под курсором — подтверждает, что
 * raycasting на плоскость уровня и snapping к сетке работают (SPEC.md,
 * разделы 5.2 и 13.1). Не строительная сущность.
 */
export function SnapCursor() {
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );

  if (!cursorPoint) return null;

  return (
    <mesh
      position={[cursorPoint.x, elevation + 0.02, cursorPoint.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.12, 0.16, 24]} />
      <meshBasicMaterial color="#2bbba8" toneMapped={false} />
    </mesh>
  );
}
