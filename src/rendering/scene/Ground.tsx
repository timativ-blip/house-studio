import { useProjectStore } from "@/application/store/useProjectStore";
import { GROUND_TEXTURE_SET } from "@/rendering/materials/textureSets";
import { useSurfaceTextures } from "@/rendering/materials/useSurfaceTextures";

/**
 * Плоскость участка. Часть визуализации, не сохраняется в проект —
 * её размер лишь отражает project.siteSize. Реальная PBR-текстура травы —
 * Poly Haven, CC0 (public/textures/CREDITS.md).
 */
export function Ground() {
  const siteSize = useProjectStore((s) => s.project.siteSize);
  const textures = useSurfaceTextures(GROUND_TEXTURE_SET, siteSize.width / 2, siteSize.depth / 2);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[siteSize.width, siteSize.depth]} />
      <meshStandardMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
