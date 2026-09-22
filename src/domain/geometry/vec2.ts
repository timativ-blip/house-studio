/** Точка на плоскости участка (XZ), см. SPEC.md, раздел 5.1. */
export interface Vec2 {
  x: number;
  z: number;
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
