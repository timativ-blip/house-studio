import { create } from "zustand";
import type { EntityId, Floor, Path, PlacedItem, Project, Wall } from "@/types/project";
import type { Vec2 } from "@/domain/geometry/vec2";
import { isValidWallLength } from "@/domain/walls/wallGeometry";
import { isValidRectangle, rectangleCorners } from "@/domain/rooms/rectangle";
import { isValidPlacement, type PlacedFootprint } from "@/domain/items/placement";
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
  type EntityRef,
} from "@/application/commands/entityCommands";
import type { Command } from "@/application/commands/types";
import { createDefaultProject } from "./createDefaultProject";
import { WORLD_CONFIG } from "@/config/world";
import {
  DEFAULT_FLOOR_MATERIAL_ID,
  DEFAULT_PATH_MATERIAL_ID,
  DEFAULT_WALL_MATERIAL_ID,
} from "@/rendering/materials/catalog";
import {
  FURNITURE_CATALOG,
  LANDSCAPE_CATALOG,
  getCatalogItemById,
  type CatalogCategory,
} from "@/rendering/catalog/items";

export type ToolId = "select" | "wall" | "room" | "furniture" | "landscape";
export type LandscapeMode = "objects" | "path";

export type Draft =
  | { tool: "wall"; start: Vec2 }
  | { tool: "room"; corner: Vec2 }
  | { tool: "path"; start: Vec2 };

export interface CatalogSelection {
  category: CatalogCategory;
  assetId: string;
}

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

  catalogSelection: CatalogSelection | null;
  landscapeMode: LandscapeMode;
  draggingItemId: EntityId | null;
  dragPreviewPosition: PlacedItem["position"] | null;

  setActiveTool: (tool: ToolId) => void;
  setSelectedEntity: (ref: EntityRef | null) => void;
  setCursorPoint: (point: Vec2 | null) => void;
  setCatalogSelection: (selection: CatalogSelection) => void;
  setLandscapeMode: (mode: LandscapeMode) => void;

  /** Клик по плоскости уровня: ведёт себя по-разному в зависимости от активного инструмента. */
  handlePlaneClick: (point: Vec2) => void;
  cancelDraft: () => void;
  deleteSelected: () => void;
  setWallMaterial: (wallId: EntityId, side: "exterior" | "interior", materialId: string) => void;
  setFloorMaterial: (floorId: EntityId, materialId: string) => void;
  setPathMaterial: (pathId: EntityId, materialId: string) => void;
  rotateSelectedItem: (deltaRad: number) => void;

  startDragItem: (id: EntityId) => void;
  updateDragPreview: (point: Vec2) => void;
  commitDrag: () => void;

  dispatch: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

const initialProject = createDefaultProject();
const initialLevelId = Object.keys(initialProject.levels)[0];

function existingItemFootprints(project: Project, excludeId?: EntityId): PlacedFootprint[] {
  return Object.values(project.entities.items)
    .filter((item) => item.id !== excludeId)
    .map((item) => ({
      center: { x: item.position.x, z: item.position.z },
      footprint: getCatalogItemById(item.assetId).footprint,
    }));
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: initialProject,
  activeLevelId: initialLevelId,
  activeTool: "select",
  selectedEntityRef: null,
  cursorPoint: null,
  draft: null,
  past: [],
  future: [],

  catalogSelection: null,
  landscapeMode: "objects",
  draggingItemId: null,
  dragPreviewPosition: null,

  setActiveTool: (tool) => {
    const base = {
      activeTool: tool,
      draft: null,
      selectedEntityRef: null,
      draggingItemId: null,
      dragPreviewPosition: null,
    };
    if (tool === "furniture") {
      set({ ...base, catalogSelection: { category: "furniture", assetId: FURNITURE_CATALOG[0].assetId } });
    } else if (tool === "landscape") {
      set({
        ...base,
        catalogSelection: { category: "landscape", assetId: LANDSCAPE_CATALOG[0].assetId },
        landscapeMode: "objects",
      });
    } else {
      set({ ...base, catalogSelection: null });
    }
  },
  setSelectedEntity: (ref) => set({ selectedEntityRef: ref }),
  setCursorPoint: (point) => set({ cursorPoint: point }),
  setCatalogSelection: (selection) => set({ catalogSelection: selection, draft: null }),
  setLandscapeMode: (mode) => set({ landscapeMode: mode, draft: null }),

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
      return;
    }

    if (activeTool === "landscape" && get().landscapeMode === "path") {
      if (!draft || draft.tool !== "path") {
        set({ draft: { tool: "path", start: point } });
        return;
      }
      if (isValidWallLength(draft.start, point)) {
        const level = get().activeLevelId;
        const path: Path = {
          id: crypto.randomUUID(),
          levelId: level,
          kind: "path",
          segments: [draft.start, point],
          width: WORLD_CONFIG.defaultPathWidth,
          materialId: DEFAULT_PATH_MATERIAL_ID,
        };
        get().dispatch(createAddPathCommand(path));
      }
      set({ draft: null });
      return;
    }

    if (activeTool === "furniture" || activeTool === "landscape") {
      const { catalogSelection, project, activeLevelId } = get();
      if (!catalogSelection) return;
      const catalogItem = getCatalogItemById(catalogSelection.assetId);
      const candidate: PlacedFootprint = { center: point, footprint: catalogItem.footprint };
      const others = existingItemFootprints(project);
      if (!isValidPlacement(candidate, project.siteSize, others)) return;

      const elevation = project.levels[activeLevelId]?.elevation ?? 0;
      const item: PlacedItem = {
        id: crypto.randomUUID(),
        levelId: activeLevelId,
        assetId: catalogItem.assetId,
        position: { x: point.x, y: elevation, z: point.z },
        rotationY: 0,
      };
      get().dispatch(createAddItemCommand(item));
    }
  },

  cancelDraft: () => set({ draft: null, draggingItemId: null, dragPreviewPosition: null }),

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

  setPathMaterial: (pathId, materialId) => {
    get().dispatch(createSetPathMaterialCommand(get().project, pathId, materialId));
  },

  rotateSelectedItem: (deltaRad) => {
    const { selectedEntityRef, project } = get();
    if (!selectedEntityRef || selectedEntityRef.kind !== "item") return;
    get().dispatch(createRotateItemCommand(project, selectedEntityRef.id, deltaRad));
  },

  startDragItem: (id) => {
    const item = get().project.entities.items[id];
    if (!item) return;
    set({
      draggingItemId: id,
      dragPreviewPosition: item.position,
      selectedEntityRef: { kind: "item", id },
    });
  },

  updateDragPreview: (point) => {
    const { draggingItemId, project } = get();
    if (!draggingItemId) return;
    const item = project.entities.items[draggingItemId];
    if (!item) return;
    set({ dragPreviewPosition: { x: point.x, y: item.position.y, z: point.z } });
  },

  commitDrag: () => {
    const { draggingItemId, dragPreviewPosition, project } = get();
    if (!draggingItemId || !dragPreviewPosition) {
      set({ draggingItemId: null, dragPreviewPosition: null });
      return;
    }
    const original = project.entities.items[draggingItemId]?.position;
    if (original && (original.x !== dragPreviewPosition.x || original.z !== dragPreviewPosition.z)) {
      get().dispatch(createMoveItemCommand(draggingItemId, original, dragPreviewPosition));
    }
    set({ draggingItemId: null, dragPreviewPosition: null });
  },
}));
