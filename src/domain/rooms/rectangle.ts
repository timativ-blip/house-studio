import type { Vec2 } from "@/domain/geometry/vec2";

/**
 * Четыре угла прямоугольника по двум противоположным точкам, по часовой
 * стрелке начиная с cornerA. См. SPEC.md, раздел 7.3.
 */
export function rectangleCorners(cornerA: Vec2, cornerB: Vec2): [Vec2, Vec2, Vec2, Vec2] {
  const p1 = cornerA;
  const p2: Vec2 = { x: cornerB.x, z: cornerA.z };
  const p3 = cornerB;
  const p4: Vec2 = { x: cornerA.x, z: cornerB.z };
  return [p1, p2, p3, p4];
}

export function isValidRectangle(cornerA: Vec2, cornerB: Vec2): boolean {
  return Math.abs(cornerA.x - cornerB.x) > 0.05 && Math.abs(cornerA.z - cornerB.z) > 0.05;
}
