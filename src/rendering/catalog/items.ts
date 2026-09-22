/**
 * Каталог размещаемых объектов. Упрощённая версия SPEC.md, раздел 10.1:
 * без GLB-моделей (`modelUrl` отсутствует) — процедурные геометрические
 * заглушки вместо реальных ассетов, до появления пайплайна ассетов
 * (раздел 19).
 */
export type CatalogCategory = "furniture" | "landscape";

export interface CatalogItem {
  assetId: string;
  name: string;
  category: CatalogCategory;
  footprint: { width: number; depth: number; height: number };
  /** Точка привязки модели — сейчас всегда центр основания (раздел 19). */
  anchor: "base-center";
}

export const FURNITURE_CATALOG: readonly CatalogItem[] = [
  {
    assetId: "sofa",
    name: "Диван",
    category: "furniture",
    footprint: { width: 1.8, depth: 0.85, height: 0.8 },
    anchor: "base-center",
  },
  {
    assetId: "table",
    name: "Стол",
    category: "furniture",
    footprint: { width: 1.2, depth: 0.8, height: 0.75 },
    anchor: "base-center",
  },
  {
    assetId: "chair",
    name: "Стул",
    category: "furniture",
    footprint: { width: 0.5, depth: 0.5, height: 0.9 },
    anchor: "base-center",
  },
  {
    assetId: "bed",
    name: "Кровать",
    category: "furniture",
    footprint: { width: 1.6, depth: 2.0, height: 0.6 },
    anchor: "base-center",
  },
] as const;

export const LANDSCAPE_CATALOG: readonly CatalogItem[] = [
  {
    assetId: "tree-round",
    name: "Дерево (лиственное)",
    category: "landscape",
    footprint: { width: 2.2, depth: 2.2, height: 4 },
    anchor: "base-center",
  },
  {
    assetId: "tree-conical",
    name: "Дерево (хвойное)",
    category: "landscape",
    footprint: { width: 1.8, depth: 1.8, height: 4.5 },
    anchor: "base-center",
  },
  {
    assetId: "bush",
    name: "Куст",
    category: "landscape",
    footprint: { width: 0.9, depth: 0.9, height: 0.7 },
    anchor: "base-center",
  },
] as const;

const ALL_ITEMS = [...FURNITURE_CATALOG, ...LANDSCAPE_CATALOG];
const ITEMS_BY_ID = new Map(ALL_ITEMS.map((item) => [item.assetId, item]));

export function getCatalogItemById(assetId: string): CatalogItem {
  const item = ITEMS_BY_ID.get(assetId);
  if (!item) {
    throw new Error(`Неизвестный идентификатор объекта каталога: "${assetId}"`);
  }
  return item;
}

export function getCatalogByCategory(category: CatalogCategory): readonly CatalogItem[] {
  return category === "furniture" ? FURNITURE_CATALOG : LANDSCAPE_CATALOG;
}
