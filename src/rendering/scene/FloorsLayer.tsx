import { useProjectStore } from "@/application/store/useProjectStore";
import { FloorMesh } from "./FloorMesh";

export function FloorsLayer() {
  const floors = useProjectStore((s) => s.project.entities.floors);

  return (
    <group name="floors">
      {Object.values(floors).map((floor) => (
        <FloorMesh key={floor.id} floor={floor} />
      ))}
    </group>
  );
}
