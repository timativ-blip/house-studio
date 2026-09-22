import { describe, expect, it } from "vitest";
import { resolveSnapPoint, snapToExistingPoints, snapToGrid } from "./snapping";

describe("snapToGrid", () => {
  it("rounds to the nearest grid step", () => {
    expect(snapToGrid({ x: 1.23, z: 4.61 }, 0.5)).toEqual({ x: 1, z: 4.5 });
  });

  it("leaves points already on the grid unchanged", () => {
    expect(snapToGrid({ x: 2, z: -3.5 }, 0.5)).toEqual({ x: 2, z: -3.5 });
  });

  it("handles a zero point", () => {
    expect(snapToGrid({ x: 0, z: 0 }, 0.5)).toEqual({ x: 0, z: 0 });
  });
});

describe("snapToExistingPoints", () => {
  const candidates = [
    { x: 0, z: 0 },
    { x: 5, z: 5 },
  ];

  it("returns the closest candidate within tolerance", () => {
    expect(snapToExistingPoints({ x: 0.1, z: 0.1 }, candidates, 0.3)).toEqual({
      x: 0,
      z: 0,
    });
  });

  it("returns null when nothing is within tolerance", () => {
    expect(snapToExistingPoints({ x: 2, z: 2 }, candidates, 0.3)).toBeNull();
  });

  it("returns null for an empty candidate list", () => {
    expect(snapToExistingPoints({ x: 0, z: 0 }, [], 0.3)).toBeNull();
  });
});

describe("resolveSnapPoint", () => {
  it("prefers existing geometry over the grid", () => {
    const result = resolveSnapPoint(
      { x: 0.1, z: 0.1 },
      { gridStep: 0.5, snapTolerance: 0.3, existingPoints: [{ x: 0, z: 0 }] },
    );
    expect(result).toEqual({ x: 0, z: 0 });
  });

  it("falls back to the grid when no geometry is nearby", () => {
    const result = resolveSnapPoint(
      { x: 1.2, z: 1.3 },
      { gridStep: 0.5, snapTolerance: 0.1, existingPoints: [{ x: 10, z: 10 }] },
    );
    expect(result).toEqual({ x: 1, z: 1.5 });
  });
});
