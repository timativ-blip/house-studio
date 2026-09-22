/**
 * Пути к реальным PBR-текстурам (Poly Haven, CC0 — см. public/textures/CREDITS.md).
 * diffuse — базовый цвет, normal — OpenGL-нормали, arm — AO/Roughness/Metalness
 * в каналах R/G/B (используем только Roughness/G, см. useSurfaceTextures).
 */
export interface TextureSet {
  diffuse: string;
  normal: string;
  arm: string;
}

function set(id: string): TextureSet {
  return {
    diffuse: `/textures/${id}/diffuse.jpg`,
    normal: `/textures/${id}/normal.jpg`,
    arm: `/textures/${id}/arm.jpg`,
  };
}

const TEXTURE_SETS: Record<string, TextureSet> = {
  "wall-plaster-white": set("wall-plaster-white"),
  "wall-plaster-beige": set("wall-plaster-beige"),
  "wall-brick-red": set("wall-brick-red"),
  "floor-wood-oak": set("floor-wood-oak"),
  "floor-tile-grey": set("floor-tile-grey"),
  "floor-concrete": set("floor-concrete"),
};

export const GROUND_TEXTURE_SET: TextureSet = set("ground-grass");

export function getTextureSet(materialId: string): TextureSet {
  const found = TEXTURE_SETS[materialId];
  if (!found) {
    throw new Error(`Нет набора текстур для материала "${materialId}"`);
  }
  return found;
}
