/**
 * Каталог материалов. Упрощённая версия SPEC.md, раздел 12.2: пока без
 * текстурных карт (baseColorMap/normalMap/…) — тот пайплайн появится на
 * Этапе 6 вместе с системой ассетов (раздел 19). Сейчас — только цвет и
 * PBR-параметры для MeshStandardMaterial, чтобы стены и полы уже можно
 * было раскрашивать.
 */
export interface MaterialDefinition {
  id: string;
  name: string;
  category: "wall" | "floor";
  baseColor: string;
  roughness: number;
  metalness: number;
}

export const MATERIALS: readonly MaterialDefinition[] = [
  {
    id: "wall-plaster-white",
    name: "Белая штукатурка",
    category: "wall",
    baseColor: "#f2efe9",
    roughness: 0.9,
    metalness: 0,
  },
  {
    id: "wall-plaster-beige",
    name: "Бежевая штукатурка",
    category: "wall",
    baseColor: "#dcc9a8",
    roughness: 0.9,
    metalness: 0,
  },
  {
    id: "wall-brick-red",
    name: "Красный кирпич",
    category: "wall",
    baseColor: "#a1543a",
    roughness: 0.95,
    metalness: 0,
  },
  {
    id: "floor-wood-oak",
    name: "Дуб",
    category: "floor",
    baseColor: "#b8895f",
    roughness: 0.6,
    metalness: 0,
  },
  {
    id: "floor-tile-grey",
    name: "Серая плитка",
    category: "floor",
    baseColor: "#aeb4b8",
    roughness: 0.3,
    metalness: 0.05,
  },
  {
    id: "floor-concrete",
    name: "Бетон",
    category: "floor",
    baseColor: "#9a9a94",
    roughness: 0.85,
    metalness: 0,
  },
] as const;

const MATERIALS_BY_ID = new Map(MATERIALS.map((m) => [m.id, m]));

export function getMaterialById(id: string): MaterialDefinition {
  const material = MATERIALS_BY_ID.get(id);
  if (!material) {
    throw new Error(`Неизвестный идентификатор материала: "${id}"`);
  }
  return material;
}

export function getMaterialsByCategory(
  category: MaterialDefinition["category"],
): readonly MaterialDefinition[] {
  return MATERIALS.filter((m) => m.category === category);
}

export const DEFAULT_WALL_MATERIAL_ID = "wall-plaster-white";
export const DEFAULT_FLOOR_MATERIAL_ID = "floor-wood-oak";
