import { create } from "zustand";
import type { EntityId, Project } from "@/types/project";
import type { Vec2 } from "@/domain/geometry/vec2";
import { createDefaultProject } from "./createDefaultProject";

export type ToolId = "select";

interface ProjectState {
  project: Project;
  activeLevelId: EntityId;
  activeTool: ToolId;
  selectedEntityId: EntityId | null;
  /** Точка на плоскости активного уровня под курсором, привязанная к сетке. */
  cursorPoint: Vec2 | null;
  setActiveTool: (tool: ToolId) => void;
  setSelectedEntity: (id: EntityId | null) => void;
  setCursorPoint: (point: Vec2 | null) => void;
}

const initialProject = createDefaultProject();
const initialLevelId = Object.keys(initialProject.levels)[0];

export const useProjectStore = create<ProjectState>((set) => ({
  project: initialProject,
  activeLevelId: initialLevelId,
  activeTool: "select",
  selectedEntityId: null,
  cursorPoint: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedEntity: (id) => set({ selectedEntityId: id }),
  setCursorPoint: (point) => set({ cursorPoint: point }),
}));
