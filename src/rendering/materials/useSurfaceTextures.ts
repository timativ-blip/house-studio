import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { TextureSet } from "./textureSets";

export interface SurfaceTextures {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

/**
 * Загружает и клонирует один комплект PBR-текстур с нужным повтором
 * (repeat) под реальный размер поверхности в метрах. Клон нужен, потому
 * что drei кэширует и переиспользует один и тот же объект текстуры для
 * одного URL — без клонирования все стены с одним материалом делили бы
 * один и тот же `repeat`.
 */
export function useSurfaceTextures(
  set: TextureSet,
  repeatX: number,
  repeatY: number,
): SurfaceTextures {
  const [diffuse, normal, arm] = useTexture([set.diffuse, set.normal, set.arm]);

  return useMemo(() => {
    const map = diffuse.clone();
    const normalMap = normal.clone();
    const roughnessMap = arm.clone();

    for (const texture of [map, normalMap, roughnessMap]) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.needsUpdate = true;
    }
    map.colorSpace = THREE.SRGBColorSpace;

    return { map, normalMap, roughnessMap };
  }, [diffuse, normal, arm, repeatX, repeatY]);
}
