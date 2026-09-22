import { useProjectStore } from "@/application/store/useProjectStore";
import { PathMesh } from "./PathMesh";

export function PathsLayer() {
  const paths = useProjectStore((s) => s.project.entities.paths);

  return (
    <group name="paths">
      {Object.values(paths).map((path) => (
        <PathMesh key={path.id} path={path} />
      ))}
    </group>
  );
}
