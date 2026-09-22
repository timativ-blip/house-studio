import { Suspense } from "react";
import { useProjectStore } from "@/application/store/useProjectStore";
import { WallMesh } from "./WallMesh";

/**
 * Каждая стена в своей Suspense-границе: пока грузится текстура новой
 * стены, уже построенные стены не должны мигать/пропадать.
 */
export function WallsLayer() {
  const walls = useProjectStore((s) => s.project.entities.walls);

  return (
    <group name="walls">
      {Object.values(walls).map((wall) => (
        <Suspense key={wall.id} fallback={null}>
          <WallMesh wall={wall} />
        </Suspense>
      ))}
    </group>
  );
}
