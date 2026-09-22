import { describe, expect, it } from "vitest";
import { isValidPlacement, isWithinSiteBounds, overlapsAabb } from "./placement";

const siteSize = { width: 10, depth: 10 };

describe("isWithinSiteBounds", () => {
  it("accepts an item fully inside the site", () => {
    const item = { center: { x: 0, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(isWithinSiteBounds(item, siteSize)).toBe(true);
  });

  it("rejects an item that extends past the edge", () => {
    const item = { center: { x: 4.5, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(isWithinSiteBounds(item, siteSize)).toBe(false);
  });

  it("accepts an item exactly flush with the edge", () => {
    const item = { center: { x: 4, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(isWithinSiteBounds(item, siteSize)).toBe(true);
  });
});

describe("overlapsAabb", () => {
  it("detects overlapping boxes", () => {
    const a = { center: { x: 0, z: 0 }, footprint: { width: 2, depth: 2 } };
    const b = { center: { x: 1, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(overlapsAabb(a, b)).toBe(true);
  });

  it("returns false for boxes that only touch at the edge", () => {
    const a = { center: { x: 0, z: 0 }, footprint: { width: 2, depth: 2 } };
    const b = { center: { x: 2, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(overlapsAabb(a, b)).toBe(false);
  });

  it("returns false for boxes far apart", () => {
    const a = { center: { x: 0, z: 0 }, footprint: { width: 2, depth: 2 } };
    const b = { center: { x: 10, z: 10 }, footprint: { width: 2, depth: 2 } };
    expect(overlapsAabb(a, b)).toBe(false);
  });
});

describe("isValidPlacement", () => {
  it("rejects placement colliding with an existing item even if in bounds", () => {
    const existing = { center: { x: 0, z: 0 }, footprint: { width: 2, depth: 2 } };
    const candidate = { center: { x: 0.5, z: 0 }, footprint: { width: 2, depth: 2 } };
    expect(isValidPlacement(candidate, siteSize, [existing])).toBe(false);
  });

  it("accepts a clear, in-bounds placement", () => {
    const existing = { center: { x: -3, z: -3 }, footprint: { width: 1, depth: 1 } };
    const candidate = { center: { x: 3, z: 3 }, footprint: { width: 1, depth: 1 } };
    expect(isValidPlacement(candidate, siteSize, [existing])).toBe(true);
  });
});
