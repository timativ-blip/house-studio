import { CURRENT_PROJECT_FORMAT_VERSION, WORLD_CONFIG } from "@/config/world";
import type { Project } from "@/types/project";

export function createDefaultProject(): Project {
  const now = new Date().toISOString();
  const groundFloorId = crypto.randomUUID();

  return {
    meta: {
      id: crypto.randomUUID(),
      name: "Новый проект",
      createdAt: now,
      updatedAt: now,
      formatVersion: CURRENT_PROJECT_FORMAT_VERSION,
    },
    siteSize: { ...WORLD_CONFIG.siteSize },
    levels: {
      [groundFloorId]: {
        id: groundFloorId,
        index: 0,
        name: "Этаж 1",
        elevation: 0,
        height: WORLD_CONFIG.defaultWallHeight,
        visible: true,
      },
    },
    entities: {
      walls: {},
      floors: {},
    },
  };
}
