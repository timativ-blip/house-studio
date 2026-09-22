import { Suspense } from "react";
import { useProjectStore } from "@/application/store/useProjectStore";
import { FloorMesh } from "./FloorMesh";

/**
 * Каждый пол в своей Suspense-границе — по той же причине, что и в
 * WallsLayer: загрузка текстуры одного пола не должна прятать остальные.
 */
export function FloorsLayer() {
  const floors = useProjectStore((s) => s.project.entities.floors);

  return (
    <group name="floors">
      {Object.values(floors).map((floor) => (
        <Suspense key={floor.id} fallback={null}>
          <FloorMesh floor={floor} />
        </Suspense>
      ))}
    </group>
  );
}
