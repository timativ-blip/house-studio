import { useProjectStore } from "@/application/store/useProjectStore";
import { PlacedItemMesh } from "./PlacedItemMesh";

export function ItemsLayer() {
  const items = useProjectStore((s) => s.project.entities.items);

  return (
    <group name="items">
      {Object.values(items).map((item) => (
        <PlacedItemMesh key={item.id} item={item} />
      ))}
    </group>
  );
}
