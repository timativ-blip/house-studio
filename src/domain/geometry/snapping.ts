import type { Vec2 } from "./vec2";
import { distance } from "./vec2";

/**
 * Привязка точки к регулярной строительной сетке.
 * См. SPEC.md, раздел 5.2.
 */
export function snapToGrid(point: Vec2, gridStep: number): Vec2 {
  return {
    x: Math.round(point.x / gridStep) * gridStep,
    z: Math.round(point.z / gridStep) * gridStep,
  };
}

/**
 * Привязка к ближайшей существующей точке геометрии (например, концу стены),
 * если она находится в пределах допуска. Возвращает null, если рядом ничего нет —
 * в этом случае вызывающий код должен использовать snapToGrid.
 */
export function snapToExistingPoints(
  point: Vec2,
  candidates: readonly Vec2[],
  tolerance: number,
): Vec2 | null {
  let closest: Vec2 | null = null;
  let closestDistance = Infinity;

  for (const candidate of candidates) {
    const d = distance(point, candidate);
    if (d <= tolerance && d < closestDistance) {
      closest = candidate;
      closestDistance = d;
    }
  }

  return closest;
}

export interface SnapContext {
  gridStep: number;
  snapTolerance: number;
  existingPoints: readonly Vec2[];
}

/**
 * Приоритет: сначала привязка к существующей геометрии, затем — к сетке.
 * Визуальная сетка в рендеринге — лишь отображение результата этой функции.
 */
export function resolveSnapPoint(rawPoint: Vec2, context: SnapContext): Vec2 {
  const geometrySnap = snapToExistingPoints(
    rawPoint,
    context.existingPoints,
    context.snapTolerance,
  );
  if (geometrySnap !== null) {
    return geometrySnap;
  }
  return snapToGrid(rawPoint, context.gridStep);
}
