import { useProjectStore } from "@/application/store/useProjectStore";
import { isValidPlacement, type PlacedFootprint } from "@/domain/items/placement";
import { getCatalogItemById } from "@/rendering/catalog/items";

/**
 * Полупрозрачный предпросмотр объекта под курсором для инструментов
 * «Мебель» и «Ландшафт» — раздел 10.2. Показывается упрощённым объёмом по
 * footprint каталога (не полной процедурной геометрией — материалы деталей
 * не параметризованы под прозрачность). Красный — недопустимое место
 * (пересечение или выход за границы участка, раздел 10.4).
 */
export function PlacementGhost() {
  const activeTool = useProjectStore((s) => s.activeTool);
  const landscapeMode = useProjectStore((s) => s.landscapeMode);
  const catalogSelection = useProjectStore((s) => s.catalogSelection);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const draggingItemId = useProjectStore((s) => s.draggingItemId);
  const elevation = useProjectStore(
    (s) => s.project.levels[s.activeLevelId]?.elevation ?? 0,
  );
  const siteSize = useProjectStore((s) => s.project.siteSize);
  const items = useProjectStore((s) => s.project.entities.items);

  const isPlacementTool =
    (activeTool === "furniture" || activeTool === "landscape") &&
    !(activeTool === "landscape" && landscapeMode === "path");

  if (!isPlacementTool || !catalogSelection || !cursorPoint || draggingItemId) return null;

  const catalogItem = getCatalogItemById(catalogSelection.assetId);
  const candidate: PlacedFootprint = { center: cursorPoint, footprint: catalogItem.footprint };
  const others: PlacedFootprint[] = Object.values(items).map((item) => ({
    center: { x: item.position.x, z: item.position.z },
    footprint: getCatalogItemById(item.assetId).footprint,
  }));
  const valid = isValidPlacement(candidate, siteSize, others);
  const color = valid ? "#2bbba8" : "#e0524f";
  const { width, depth, height } = catalogItem.footprint;

  return (
    <group position={[cursorPoint.x, elevation, cursorPoint.z]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(width, depth) / 2, Math.max(width, depth) / 2 + 0.06, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}
