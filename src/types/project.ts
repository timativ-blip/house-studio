/**
 * Типы проекта. Полная модель — см. SPEC.md, раздел 6. Проёмы (раздел 6.3)
 * появятся на Этапе 5.
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

/** Мебель, декор и растения — единая механика размещения, раздел 6.5, 10. */
export interface PlacedItem extends LevelReference {
  id: EntityId;
  assetId: string;
  position: { x: number; y: number; z: number };
  rotationY: number;
  scale?: number;
  materialVariantId?: string;
}

/** База для объектов территории, раздел 11.2. Сейчас используется только "path". */
export interface LandscapeEntity extends LevelReference {
  id: EntityId;
  kind: "path" | "fence" | "plant" | "decor";
}

/** Прямая дорожка (MVP — один сегмент), раздел 11.2. */
export interface Path extends LandscapeEntity {
  kind: "path";
  segments: [Vec2, Vec2];
  width: number;
  materialId: string;
}

export interface Project {
  meta: ProjectMeta;
  siteSize: { width: number; depth: number };
  levels: Record<EntityId, Level>;
  entities: {
    walls: Record<EntityId, Wall>;
    floors: Record<EntityId, Floor>;
    items: Record<EntityId, PlacedItem>;
    paths: Record<EntityId, Path>;
  };
}
