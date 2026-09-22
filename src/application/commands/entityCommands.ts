import { produce } from "immer";
import type { EntityId, Floor, Project, Wall } from "@/types/project";
import type { Command } from "./types";

export type EntityRef = { kind: "wall"; id: EntityId } | { kind: "floor"; id: EntityId };

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

/** Читает текущую сущность из проекта, чтобы invert() мог её восстановить. */
export function createRemoveEntityCommand(project: Project, ref: EntityRef): Command {
  if (ref.kind === "wall") {
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
