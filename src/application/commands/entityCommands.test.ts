import { describe, expect, it } from "vitest";
import type { Floor, Path, PlacedItem, Project, Wall } from "@/types/project";
import {
  createAddItemCommand,
  createAddPathCommand,
  createAddWallCommand,
  createMoveItemCommand,
  createRemoveEntityCommand,
  createRoomCommand,
  createRotateItemCommand,
  createSetFloorMaterialCommand,
  createSetPathMaterialCommand,
  createSetWallMaterialCommand,
} from "./entityCommands";

function emptyProject(): Project {
  return {
    meta: {
      id: "p1",
      name: "Test",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      formatVersion: "0.1.0",
    },
    siteSize: { width: 40, depth: 40 },
    levels: {},
    entities: { walls: {}, floors: {}, items: {}, paths: {} },
  };
}

function makeWall(id: string): Wall {
  return {
    id,
    levelId: "level-1",
    start: { x: 0, z: 0 },
    end: { x: 4, z: 0 },
    height: 2.8,
    thickness: 0.2,
    materialId: { exterior: "wall-plaster-white", interior: "wall-plaster-white" },
    openingIds: [],
  };
}

function makeFloor(id: string): Floor {
  return {
    id,
    levelId: "level-1",
    polygon: [
      { x: 0, z: 0 },
      { x: 4, z: 0 },
      { x: 4, z: 4 },
      { x: 0, z: 4 },
    ],
    materialId: "floor-wood-oak",
    thickness: 0.1,
  };
}

function makeItem(id: string): PlacedItem {
  return {
    id,
    levelId: "level-1",
    assetId: "sofa",
    position: { x: 1, y: 0, z: 1 },
    rotationY: 0,
  };
}

function makePath(id: string): Path {
  return {
    id,
    levelId: "level-1",
    kind: "path",
    segments: [
      { x: 0, z: 0 },
      { x: 3, z: 0 },
    ],
    width: 1,
    materialId: "path-gravel",
  };
}

describe("createAddWallCommand", () => {
  it("adds the wall on apply and removes it on invert", () => {
    const project = emptyProject();
    const wall = makeWall("w1");
    const command = createAddWallCommand(wall);

    const applied = command.apply(project);
    expect(applied.entities.walls.w1).toEqual(wall);

    const inverted = command.invert(applied);
    expect(inverted.entities.walls.w1).toBeUndefined();
  });
});

describe("createRoomCommand", () => {
  it("adds all four walls and the floor atomically", () => {
    const project = emptyProject();
    const walls = [makeWall("w1"), makeWall("w2"), makeWall("w3"), makeWall("w4")];
    const floor = makeFloor("f1");
    const command = createRoomCommand(walls, floor);

    const applied = command.apply(project);
    expect(Object.keys(applied.entities.walls)).toHaveLength(4);
    expect(applied.entities.floors.f1).toEqual(floor);
  });

  it("removes all four walls and the floor on invert", () => {
    const project = emptyProject();
    const walls = [makeWall("w1"), makeWall("w2"), makeWall("w3"), makeWall("w4")];
    const floor = makeFloor("f1");
    const command = createRoomCommand(walls, floor);

    const applied = command.apply(project);
    const inverted = command.invert(applied);

    expect(Object.keys(inverted.entities.walls)).toHaveLength(0);
    expect(inverted.entities.floors.f1).toBeUndefined();
  });
});

describe("createRemoveEntityCommand", () => {
  it("restores the exact wall on invert", () => {
    const project = emptyProject();
    const wall = makeWall("w1");
    project.entities.walls.w1 = wall;

    const command = createRemoveEntityCommand(project, { kind: "wall", id: "w1" });
    const applied = command.apply(project);
    expect(applied.entities.walls.w1).toBeUndefined();

    const restored = command.invert(applied);
    expect(restored.entities.walls.w1).toEqual(wall);
  });
});

describe("createSetWallMaterialCommand", () => {
  it("changes one side's material and restores the previous one on invert", () => {
    const project = emptyProject();
    project.entities.walls.w1 = makeWall("w1");

    const command = createSetWallMaterialCommand(project, "w1", "exterior", "wall-brick-red");
    const applied = command.apply(project);
    expect(applied.entities.walls.w1.materialId.exterior).toBe("wall-brick-red");
    expect(applied.entities.walls.w1.materialId.interior).toBe("wall-plaster-white");

    const reverted = command.invert(applied);
    expect(reverted.entities.walls.w1.materialId.exterior).toBe("wall-plaster-white");
  });
});

describe("createSetFloorMaterialCommand", () => {
  it("changes the floor material and restores it on invert", () => {
    const project = emptyProject();
    project.entities.floors.f1 = makeFloor("f1");

    const command = createSetFloorMaterialCommand(project, "f1", "floor-tile-grey");
    const applied = command.apply(project);
    expect(applied.entities.floors.f1.materialId).toBe("floor-tile-grey");

    const reverted = command.invert(applied);
    expect(reverted.entities.floors.f1.materialId).toBe("floor-wood-oak");
  });
});

describe("createAddItemCommand", () => {
  it("adds the item on apply and removes it on invert", () => {
    const project = emptyProject();
    const item = makeItem("i1");
    const command = createAddItemCommand(item);

    const applied = command.apply(project);
    expect(applied.entities.items.i1).toEqual(item);

    const inverted = command.invert(applied);
    expect(inverted.entities.items.i1).toBeUndefined();
  });
});

describe("createMoveItemCommand", () => {
  it("moves the item and restores the original position on invert", () => {
    const project = emptyProject();
    project.entities.items.i1 = makeItem("i1");
    const from = { x: 1, y: 0, z: 1 };
    const to = { x: 5, y: 0, z: 2 };

    const command = createMoveItemCommand("i1", from, to);
    const applied = command.apply(project);
    expect(applied.entities.items.i1.position).toEqual(to);

    const reverted = command.invert(applied);
    expect(reverted.entities.items.i1.position).toEqual(from);
  });
});

describe("createRotateItemCommand", () => {
  it("adds the delta to rotation and subtracts it back on invert", () => {
    const project = emptyProject();
    project.entities.items.i1 = makeItem("i1");

    const command = createRotateItemCommand(project, "i1", Math.PI / 2);
    const applied = command.apply(project);
    expect(applied.entities.items.i1.rotationY).toBeCloseTo(Math.PI / 2);

    const reverted = command.invert(applied);
    expect(reverted.entities.items.i1.rotationY).toBeCloseTo(0);
  });
});

describe("createAddPathCommand", () => {
  it("adds the path on apply and removes it on invert", () => {
    const project = emptyProject();
    const path = makePath("p1");
    const command = createAddPathCommand(path);

    const applied = command.apply(project);
    expect(applied.entities.paths.p1).toEqual(path);

    const inverted = command.invert(applied);
    expect(inverted.entities.paths.p1).toBeUndefined();
  });
});

describe("createSetPathMaterialCommand", () => {
  it("changes the path material and restores it on invert", () => {
    const project = emptyProject();
    project.entities.paths.p1 = makePath("p1");

    const command = createSetPathMaterialCommand(project, "p1", "path-pavers");
    const applied = command.apply(project);
    expect(applied.entities.paths.p1.materialId).toBe("path-pavers");

    const reverted = command.invert(applied);
    expect(reverted.entities.paths.p1.materialId).toBe("path-gravel");
  });
});

describe("createRemoveEntityCommand for items and paths", () => {
  it("restores the exact item on invert", () => {
    const project = emptyProject();
    const item = makeItem("i1");
    project.entities.items.i1 = item;

    const command = createRemoveEntityCommand(project, { kind: "item", id: "i1" });
    const applied = command.apply(project);
    expect(applied.entities.items.i1).toBeUndefined();

    const restored = command.invert(applied);
    expect(restored.entities.items.i1).toEqual(item);
  });

  it("restores the exact path on invert", () => {
    const project = emptyProject();
    const path = makePath("p1");
    project.entities.paths.p1 = path;

    const command = createRemoveEntityCommand(project, { kind: "path", id: "p1" });
    const applied = command.apply(project);
    expect(applied.entities.paths.p1).toBeUndefined();

    const restored = command.invert(applied);
    expect(restored.entities.paths.p1).toEqual(path);
  });
});
