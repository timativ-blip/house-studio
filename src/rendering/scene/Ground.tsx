import { useProjectStore } from "@/application/store/useProjectStore";

/**
 * Плоскость участка. Часть визуализации, не сохраняется в проект —
 * её размер лишь отражает project.siteSize.
 */
export function Ground() {
  const siteSize = useProjectStore((s) => s.project.siteSize);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[siteSize.width, siteSize.depth]} />
      <meshStandardMaterial color="#8fb996" roughness={1} metalness={0} />
    </mesh>
  );
}
