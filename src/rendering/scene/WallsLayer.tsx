import { useProjectStore } from "@/application/store/useProjectStore";
import { WallMesh } from "./WallMesh";

export function WallsLayer() {
  const walls = useProjectStore((s) => s.project.entities.walls);

  return (
    <group name="walls">
      {Object.values(walls).map((wall) => (
        <WallMesh key={wall.id} wall={wall} />
      ))}
    </group>
  );
}
