import { Grid } from "@react-three/drei";
import { WORLD_CONFIG } from "@/config/world";

/**
 * Вспомогательная строительная сетка. Только визуализация привязки
 * (см. domain/geometry/snapping.ts) — не строительная сущность и не
 * попадает в сохраняемый проект.
 */
export function EditorGrid() {
  const { width, depth } = WORLD_CONFIG.siteSize;

  return (
    <Grid
      args={[width, depth]}
      cellSize={WORLD_CONFIG.gridStep}
      cellThickness={0.5}
      cellColor="#5f6b66"
      sectionSize={WORLD_CONFIG.gridStep * 10}
      sectionThickness={1}
      sectionColor="#2bbba8"
      fadeDistance={Math.max(width, depth) * 1.2}
      fadeStrength={1}
      infiniteGrid={false}
      position={[0, 0.01, 0]}
    />
  );
}
