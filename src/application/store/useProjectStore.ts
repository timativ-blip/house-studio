import { create } from "zustand";
import type { EntityId, Project } from "@/types/project";
import { createDefaultProject } from "./createDefaultProject";

export type ToolId = "select";

interface ProjectState {
  project: Project;
  activeLevelId: EntityId;
  activeTool: ToolId;
  selectedEntityId: EntityId | null;
  setActiveTool: (tool: ToolId) => void;
  setSelectedEntity: (id: EntityId | null) => void;
}

const initialProject = createDefaultProject();
const initialLevelId = Object.keys(initialProject.levels)[0];

export const useProjectStore = create<ProjectState>((set) => ({
  project: initialProject,
  activeLevelId: initialLevelId,
  activeTool: "select",
  selectedEntityId: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedEntity: (id) => set({ selectedEntityId: id }),
}));
