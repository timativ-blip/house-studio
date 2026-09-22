import { describe, expect, it } from "vitest";
import {
  isValidWallLength,
  wallAngle,
  wallCenter,
  wallGeometryParams,
  wallLength,
} from "./wallGeometry";

describe("wallLength", () => {
  it("computes the straight-line distance between endpoints", () => {
    expect(wallLength({ x: 0, z: 0 }, { x: 3, z: 4 })).toBeCloseTo(5);
  });
});

describe("isValidWallLength", () => {
  it("rejects a zero-length wall", () => {
    expect(isValidWallLength({ x: 1, z: 1 }, { x: 1, z: 1 })).toBe(false);
  });

  it("accepts a normal wall", () => {
    expect(isValidWallLength({ x: 0, z: 0 }, { x: 2, z: 0 })).toBe(true);
  });
});

describe("wallAngle", () => {
  it("is 0 for a wall running along +X", () => {
    expect(wallAngle({ x: 0, z: 0 }, { x: 5, z: 0 })).toBeCloseTo(0);
  });

  it("is +90° (PI/2) for a wall running along +Z", () => {
    expect(wallAngle({ x: 0, z: 0 }, { x: 0, z: 5 })).toBeCloseTo(Math.PI / 2);
  });
});

describe("wallCenter", () => {
  it("is the midpoint of the endpoints", () => {
    expect(wallCenter({ x: 0, z: 0 }, { x: 4, z: 2 })).toEqual({ x: 2, z: 1 });
  });
});

describe("wallGeometryParams", () => {
  it("combines length, angle and center", () => {
    expect(wallGeometryParams({ x: 0, z: 0 }, { x: 4, z: 0 })).toEqual({
      length: 4,
      angle: 0,
      center: { x: 2, z: 0 },
    });
  });
});
