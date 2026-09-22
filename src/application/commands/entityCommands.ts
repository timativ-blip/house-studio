import { produce } from "immer";
import type { EntityId, Floor, Path, PlacedItem, Project, Wall } from "@/types/project";
import type { Command } from "./types";

export type EntityRef =
  | { kind: "wall"; id: EntityId }
  | { kind: "floor"; id: EntityId }
  | { kind: "item"; id: EntityId }
  | { kind: "path"; id: EntityId };

export function createAddWallCommand(wall: Wall): Command {
  return {
    id: crypto.randomUUID(),
    label: "Добавить стену",
    apply: (project) =>
      produce(project, (draft) => {
        draft.entities.walls[wall.id] = wall;
      }),
    invert: (project) =>
      produce(project, (draft) => {
        delete draft.entities.walls[wall.id];
      }),
  };
}

/**
 * Создаёт комнату: четыре стены и пол одной атомарной командой.
 * См. SPEC.md, раздел 7.3 — либо создаётся вся комната, либо ничего.
 */
export function createRoomCommand(walls: Wall[], floor: Floor): Command {
  const wallIds = walls.map((w) => w.id);
  return {
    id: crypto.randomUUID(),
    label: "Создать комнату",
    apply: (project) =>
      produce(project, (draft) => {
        for (const wall of walls) {
          draft.entities.walls[wall.id] = wall;
        }
        draft.entities.floors[floor.id] = floor;
      }),
    invert: (project) =>
      produce(project, (draft) => {
        for (const id of wallIds) {
          delete draft.entities.walls[id];
        }
        delete draft.entities.floors[floor.id];
      }),
  };
}

export function createAddItemCommand(item: PlacedItem): Command {
  return {
    id: crypto.randomUUID(),
    label: "Разместить объект",
    apply: (project) =>
      produce(project, (draft) => {
        draft.entities.items[item.id] = item;
      }),
    invert: (project) =>
      produce(project, (draft) => {
        delete draft.entities.items[item.id];
      }),
  };
}

export function createAddPathCommand(path: Path): Command {
  return {
    id: crypto.randomUUID(),
    label: "Добавить дорожку",
    apply: (project) =>
      produce(project, (draft) => {
        draft.entities.paths[path.id] = path;
      }),
    invert: (project) =>
      produce(project, (draft) => {
        delete draft.entities.paths[path.id];
      }),
  };
}

export function createMoveItemCommand(
  itemId: EntityId,
  from: PlacedItem["position"],
  to: PlacedItem["position"],
): Command {
  return {
    id: crypto.randomUUID(),
    label: "Переместить объект",
    apply: (p) =>
      produce(p, (draft) => {
        draft.entities.items[itemId].position = to;
      }),
    invert: (p) =>
      produce(p, (draft) => {
        draft.entities.items[itemId].position = from;
      }),
  };
}

export function createRotateItemCommand(project: Project, itemId: EntityId, deltaRad: number): Command {
  const previous = project.entities.items[itemId].rotationY;
  const next = previous + deltaRad;
  return {
    id: crypto.randomUUID(),
    label: "Повернуть объект",
    apply: (p) =>
      produce(p, (draft) => {
        draft.entities.items[itemId].rotationY = next;
      }),
    invert: (p) =>
      produce(p, (draft) => {
        draft.entities.items[itemId].rotationY = previous;
      }),
  };
}

/** Читает текущую сущность из проекта, чтобы invert() мог её восстановить. */
export function createRemoveEntityCommand(project: Project, ref: EntityRef): Command {
  switch (ref.kind) {
    case "wall": {
      const wall = project.entities.walls[ref.id];
      return {
        id: crypto.randomUUID(),
        label: "Удалить стену",
        apply: (p) =>
          produce(p, (draft) => {
            delete draft.entities.walls[ref.id];
          }),
        invert: (p) =>
          produce(p, (draft) => {
            draft.entities.walls[ref.id] = wall;
          }),
      };
    }
    case "floor": {
      const floor = project.entities.floors[ref.id];
      return {
        id: crypto.randomUUID(),
        label: "Удалить пол",
        apply: (p) =>
          produce(p, (draft) => {
            delete draft.entities.floors[ref.id];
          }),
        invert: (p) =>
          produce(p, (draft) => {
            draft.entities.floors[ref.id] = floor;
          }),
      };
    }
    case "item": {
      const item = project.entities.items[ref.id];
      return {
        id: crypto.randomUUID(),
        label: "Удалить объект",
        apply: (p) =>
          produce(p, (draft) => {
            delete draft.entities.items[ref.id];
          }),
        invert: (p) =>
          produce(p, (draft) => {
            draft.entities.items[ref.id] = item;
          }),
      };
    }
    case "path": {
      const path = project.entities.paths[ref.id];
      return {
        id: crypto.randomUUID(),
        label: "Удалить дорожку",
        apply: (p) =>
          produce(p, (draft) => {
            delete draft.entities.paths[ref.id];
          }),
        invert: (p) =>
          produce(p, (draft) => {
            draft.entities.paths[ref.id] = path;
          }),
      };
    }
  }
}

export function createSetWallMaterialCommand(
  project: Project,
  wallId: EntityId,
  side: "exterior" | "interior",
  materialId: string,
): Command {
  const previous = project.entities.walls[wallId].materialId[side];
  return {
    id: crypto.randomUUID(),
    label: "Изменить материал стены",
    apply: (p) =>
      produce(p, (draft) => {
        draft.entities.walls[wallId].materialId[side] = materialId;
      }),
    invert: (p) =>
      produce(p, (draft) => {
        draft.entities.walls[wallId].materialId[side] = previous;
      }),
  };
}

export function createSetFloorMaterialCommand(
  project: Project,
  floorId: EntityId,
  materialId: string,
): Command {
  const previous = project.entities.floors[floorId].materialId;
  return {
    id: crypto.randomUUID(),
    label: "Изменить материал пола",
    apply: (p) =>
      produce(p, (draft) => {
        draft.entities.floors[floorId].materialId = materialId;
      }),
    invert: (p) =>
      produce(p, (draft) => {
        draft.entities.floors[floorId].materialId = previous;
      }),
  };
}

export function createSetPathMaterialCommand(
  project: Project,
  pathId: EntityId,
  materialId: string,
): Command {
  const previous = project.entities.paths[pathId].materialId;
  return {
    id: crypto.randomUUID(),
    label: "Изменить материал дорожки",
    apply: (p) =>
      produce(p, (draft) => {
        draft.entities.paths[pathId].materialId = materialId;
      }),
    invert: (p) =>
      produce(p, (draft) => {
        draft.entities.paths[pathId].materialId = previous;
      }),
  };
}
