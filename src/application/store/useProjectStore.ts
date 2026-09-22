import { create } from "zustand";
import type { EntityId, Floor, Project, Wall } from "@/types/project";
import type { Vec2 } from "@/domain/geometry/vec2";
import { isValidWallLength } from "@/domain/walls/wallGeometry";
import { isValidRectangle, rectangleCorners } from "@/domain/rooms/rectangle";
import {
  createAddWallCommand,
  createRemoveEntityCommand,
  createRoomCommand,
  createSetFloorMaterialCommand,
  createSetWallMaterialCommand,
  type EntityRef,
} from "@/application/commands/entityCommands";
import type { Command } from "@/application/commands/types";
import { createDefaultProject } from "./createDefaultProject";
import { WORLD_CONFIG } from "@/config/world";
import { DEFAULT_FLOOR_MATERIAL_ID, DEFAULT_WALL_MATERIAL_ID } from "@/rendering/materials/catalog";

export type ToolId = "select" | "wall" | "room";

export type Draft = { tool: "wall"; start: Vec2 } | { tool: "room"; corner: Vec2 };

const MAX_HISTORY = 100;

interface ProjectState {
  project: Project;
  activeLevelId: EntityId;
  activeTool: ToolId;
  selectedEntityRef: EntityRef | null;
  /** Точка на плоскости активного уровня под курсором, привязанная к сетке/геометрии. */
  cursorPoint: Vec2 | null;
  draft: Draft | null;
  past: Command[];
  future: Command[];

  setActiveTool: (tool: ToolId) => void;
  setSelectedEntity: (ref: EntityRef | null) => void;
  setCursorPoint: (point: Vec2 | null) => void;

  /** Клик по плоскости уровня: ведёт себя по-разному в зависимости от активного инструмента. */
  handlePlaneClick: (point: Vec2) => void;
  cancelDraft: () => void;
  deleteSelected: () => void;
  setWallMaterial: (wallId: EntityId, side: "exterior" | "interior", materialId: string) => void;
  setFloorMaterial: (floorId: EntityId, materialId: string) => void;

  dispatch: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

const initialProject = createDefaultProject();
const initialLevelId = Object.keys(initialProject.levels)[0];

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: initialProject,
  activeLevelId: initialLevelId,
  activeTool: "select",
  selectedEntityRef: null,
  cursorPoint: null,
  draft: null,
  past: [],
  future: [],

  setActiveTool: (tool) => set({ activeTool: tool, draft: null, selectedEntityRef: null }),
  setSelectedEntity: (ref) => set({ selectedEntityRef: ref }),
  setCursorPoint: (point) => set({ cursorPoint: point }),

  dispatch: (command) => {
    set((state) => ({
      project: command.apply(state.project),
      past: [...state.past, command].slice(-MAX_HISTORY),
      future: [],
    }));
  },

  undo: () => {
    const { past } = get();
    const command = past.at(-1);
    if (!command) return;
    set((state) => ({
      project: command.invert(state.project),
      past: state.past.slice(0, -1),
      future: [...state.future, command],
    }));
  },

  redo: () => {
    const { future } = get();
    const command = future.at(-1);
    if (!command) return;
    set((state) => ({
      project: command.apply(state.project),
      past: [...state.past, command],
      future: state.future.slice(0, -1),
    }));
  },

  handlePlaneClick: (point) => {
    const { activeTool, draft } = get();

    if (activeTool === "select") {
      set({ selectedEntityRef: null });
      return;
    }

    if (activeTool === "wall") {
      if (!draft || draft.tool !== "wall") {
        set({ draft: { tool: "wall", start: point } });
        return;
      }
      if (isValidWallLength(draft.start, point)) {
        const level = get().activeLevelId;
        const wall: Wall = {
          id: crypto.randomUUID(),
          levelId: level,
          start: draft.start,
          end: point,
          height: WORLD_CONFIG.defaultWallHeight,
          thickness: WORLD_CONFIG.defaultWallThickness,
          materialId: { exterior: DEFAULT_WALL_MATERIAL_ID, interior: DEFAULT_WALL_MATERIAL_ID },
          openingIds: [],
        };
        get().dispatch(createAddWallCommand(wall));
      }
      set({ draft: null });
      return;
    }

    if (activeTool === "room") {
      if (!draft || draft.tool !== "room") {
        set({ draft: { tool: "room", corner: point } });
        return;
      }
      if (isValidRectangle(draft.corner, point)) {
        const level = get().activeLevelId;
        const [p1, p2, p3, p4] = rectangleCorners(draft.corner, point);
        const segments: [Vec2, Vec2][] = [
          [p1, p2],
          [p2, p3],
          [p3, p4],
          [p4, p1],
        ];
        const walls: Wall[] = segments.map(([start, end]) => ({
          id: crypto.randomUUID(),
          levelId: level,
          start,
          end,
          height: WORLD_CONFIG.defaultWallHeight,
          thickness: WORLD_CONFIG.defaultWallThickness,
          materialId: { exterior: DEFAULT_WALL_MATERIAL_ID, interior: DEFAULT_WALL_MATERIAL_ID },
          openingIds: [],
        }));
        const floor: Floor = {
          id: crypto.randomUUID(),
          levelId: level,
          polygon: [p1, p2, p3, p4],
          materialId: DEFAULT_FLOOR_MATERIAL_ID,
          thickness: 0.1,
        };
        get().dispatch(createRoomCommand(walls, floor));
      }
      set({ draft: null });
    }
  },

  cancelDraft: () => set({ draft: null }),

  deleteSelected: () => {
    const { selectedEntityRef, project } = get();
    if (!selectedEntityRef) return;
    get().dispatch(createRemoveEntityCommand(project, selectedEntityRef));
    set({ selectedEntityRef: null });
  },

  setWallMaterial: (wallId, side, materialId) => {
    get().dispatch(createSetWallMaterialCommand(get().project, wallId, side, materialId));
  },

  setFloorMaterial: (floorId, materialId) => {
    get().dispatch(createSetFloorMaterialCommand(get().project, floorId, materialId));
  },
}));
