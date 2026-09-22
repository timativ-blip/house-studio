import { describe, expect, it } from "vitest";
import { isValidRectangle, rectangleCorners } from "./rectangle";

describe("rectangleCorners", () => {
  it("returns four corners clockwise starting from cornerA", () => {
    const corners = rectangleCorners({ x: 0, z: 0 }, { x: 4, z: 3 });
    expect(corners).toEqual([
      { x: 0, z: 0 },
      { x: 4, z: 0 },
      { x: 4, z: 3 },
      { x: 0, z: 3 },
    ]);
  });

  it("handles a corner pair given in reverse order", () => {
    const corners = rectangleCorners({ x: 4, z: 3 }, { x: 0, z: 0 });
    expect(corners).toEqual([
      { x: 4, z: 3 },
      { x: 0, z: 3 },
      { x: 0, z: 0 },
      { x: 4, z: 0 },
    ]);
  });
});

describe("isValidRectangle", () => {
  it("rejects a degenerate rectangle (zero width or depth)", () => {
    expect(isValidRectangle({ x: 0, z: 0 }, { x: 0, z: 5 })).toBe(false);
    expect(isValidRectangle({ x: 0, z: 0 }, { x: 5, z: 0 })).toBe(false);
  });

  it("accepts a normal rectangle", () => {
    expect(isValidRectangle({ x: 0, z: 0 }, { x: 5, z: 5 })).toBe(true);
  });
});
