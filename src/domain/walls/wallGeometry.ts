import type { Vec2 } from "@/domain/geometry/vec2";
import { distance } from "@/domain/geometry/vec2";

/** Минимальная допустимая длина стены, метры — исключает вырожденную геометрию. */
export const MIN_WALL_LENGTH = 0.05;

export function wallLength(start: Vec2, end: Vec2): number {
  return distance(start, end);
}

export function isValidWallLength(start: Vec2, end: Vec2): boolean {
  return wallLength(start, end) >= MIN_WALL_LENGTH;
}

/** Угол поворота стены вокруг Y, радианы. См. SPEC.md, раздел 7.2. */
export function wallAngle(start: Vec2, end: Vec2): number {
  return Math.atan2(end.z - start.z, end.x - start.x);
}

export function wallCenter(start: Vec2, end: Vec2): Vec2 {
  return { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 };
}

export interface WallGeometryParams {
  length: number;
  angle: number;
  center: Vec2;
}

/**
 * Параметры BoxGeometry для стены: центр отрезка, угол поворота вокруг Y
 * и длина. Высота и толщина берутся из самой стены. См. SPEC.md, раздел 7.2:
 * поворот стены выполняется от start к end относительно оси X.
 */
export function wallGeometryParams(start: Vec2, end: Vec2): WallGeometryParams {
  return {
    length: wallLength(start, end),
    angle: wallAngle(start, end),
    center: wallCenter(start, end),
  };
}
