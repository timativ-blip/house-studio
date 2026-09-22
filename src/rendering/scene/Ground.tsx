import { useMemo } from "react";
import { useProjectStore } from "@/application/store/useProjectStore";
import { getGrassTexture } from "@/rendering/materials/proceduralTextures";

/**
 * Плоскость участка. Часть визуализации, не сохраняется в проект —
 * её размер лишь отражает project.siteSize.
 */
export function Ground() {
  const siteSize = useProjectStore((s) => s.project.siteSize);

  const texture = useMemo(() => {
    const t = getGrassTexture().clone();
    t.needsUpdate = true;
    t.repeat.set(siteSize.width / 2, siteSize.depth / 2);
    return t;
  }, [siteSize.width, siteSize.depth]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[siteSize.width, siteSize.depth]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  );
}
