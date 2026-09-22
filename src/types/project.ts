/**
 * Типы проекта. Полная модель — см. SPEC.md, раздел 6. Проёмы и предметы
 * интерьера (раздел 6.3, 6.5) появятся на Этапах 3 и 5.
 */
import type { Vec2 } from "@/domain/geometry/vec2";

export type EntityId = string;

export interface LevelReference {
  levelId: EntityId;
}

export interface Level {
  id: EntityId;
  index: number;
  name: string;
  /** Высота чистого пола уровня в мировых координатах, метры. */
  elevation: number;
  /** Высота этажа от пола до пола следующего уровня, метры. */
  height: number;
  visible: boolean;
}

export interface ProjectMeta {
  id: EntityId;
  name: string;
  createdAt: string;
  updatedAt: string;
  formatVersion: string;
}

/** См. SPEC.md, раздел 6.2. */
export interface Wall extends LevelReference {
  id: EntityId;
  start: Vec2;
  end: Vec2;
  height: number;
  thickness: number;
  materialId: {
    exterior: string;
    interior: string;
  };
  openingIds: EntityId[];
}

/** См. SPEC.md, раздел 6.4. */
export interface Floor extends LevelReference {
  id: EntityId;
  polygon: Vec2[];
  materialId: string;
  thickness: number;
}

export interface Project {
  meta: ProjectMeta;
  siteSize: { width: number; depth: number };
  levels: Record<EntityId, Level>;
  entities: {
    walls: Record<EntityId, Wall>;
    floors: Record<EntityId, Floor>;
  };
}
