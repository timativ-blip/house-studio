import type { Vec2 } from "@/domain/geometry/vec2";

export interface Footprint {
  width: number;
  depth: number;
}

export interface PlacedFootprint {
  center: Vec2;
  footprint: Footprint;
}

/** Ограничивающий прямоугольник объекта по его центру и footprint. */
function bounds(item: PlacedFootprint) {
  return {
    minX: item.center.x - item.footprint.width / 2,
    maxX: item.center.x + item.footprint.width / 2,
    minZ: item.center.z - item.footprint.depth / 2,
    maxZ: item.center.z + item.footprint.depth / 2,
  };
}

/**
 * Проверка, что объект целиком помещается в границы участка.
 * См. SPEC.md, раздел 10.4.
 */
export function isWithinSiteBounds(
  item: PlacedFootprint,
  siteSize: { width: number; depth: number },
): boolean {
  const b = bounds(item);
  const halfWidth = siteSize.width / 2;
  const halfDepth = siteSize.depth / 2;
  return b.minX >= -halfWidth && b.maxX <= halfWidth && b.minZ >= -halfDepth && b.maxZ <= halfDepth;
}

/** Пересечение двух ограничивающих прямоугольников (AABB), раздел 10.4. */
export function overlapsAabb(a: PlacedFootprint, b: PlacedFootprint): boolean {
  const boundsA = bounds(a);
  const boundsB = bounds(b);
  return (
    boundsA.minX < boundsB.maxX &&
    boundsA.maxX > boundsB.minX &&
    boundsA.minZ < boundsB.maxZ &&
    boundsA.maxZ > boundsB.minZ
  );
}

export function collidesWithAny(item: PlacedFootprint, others: readonly PlacedFootprint[]): boolean {
  return others.some((other) => overlapsAabb(item, other));
}

export function isValidPlacement(
  item: PlacedFootprint,
  siteSize: { width: number; depth: number },
  others: readonly PlacedFootprint[],
): boolean {
  return isWithinSiteBounds(item, siteSize) && !collidesWithAny(item, others);
}
