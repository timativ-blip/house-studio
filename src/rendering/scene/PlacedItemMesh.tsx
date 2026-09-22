import type { ThreeEvent } from "@react-three/fiber";
import { useProjectStore } from "@/application/store/useProjectStore";
import { ItemGeometry } from "./ItemGeometry";
import { getCatalogItemById } from "@/rendering/catalog/items";
import type { PlacedItem } from "@/types/project";

/**
 * Обёртка над процедурной геометрией предмета: позиция/поворот из данных
 * проекта (или из живого превью при перетаскивании — раздел 10.3),
 * выделение и клик для выбора/начала перетаскивания.
 */
export function PlacedItemMesh({ item }: { item: PlacedItem }) {
  const selectedRef = useProjectStore((s) => s.selectedEntityRef);
  const setSelectedEntity = useProjectStore((s) => s.setSelectedEntity);
  const activeTool = useProjectStore((s) => s.activeTool);
  const startDragItem = useProjectStore((s) => s.startDragItem);
  const draggingItemId = useProjectStore((s) => s.draggingItemId);
  const dragPreviewPosition = useProjectStore((s) => s.dragPreviewPosition);

  const isSelected = selectedRef?.kind === "item" && selectedRef.id === item.id;
  const isDragging = draggingItemId === item.id;
  const position = isDragging && dragPreviewPosition ? dragPreviewPosition : item.position;
  const footprint = getCatalogItemById(item.assetId).footprint;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (activeTool === "select") {
      setSelectedEntity({ kind: "item", id: item.id });
    }
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (activeTool !== "select") return;
    event.stopPropagation();
    startDragItem(item.id);
  };

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[0, item.rotationY, 0]}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <ItemGeometry assetId={item.assetId} />
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              Math.max(footprint.width, footprint.depth) / 2,
              Math.max(footprint.width, footprint.depth) / 2 + 0.05,
              24,
            ]}
          />
          <meshBasicMaterial color="#2bbba8" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
