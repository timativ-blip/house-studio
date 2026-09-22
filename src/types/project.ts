/**
 * Базовые типы проекта. Полная модель данных (стены, полы, проёмы, предметы)
 * появится на Этапе 2 — см. SPEC.md, раздел 6. Здесь только то, что нужно
 * Этапу 0: метаданные проекта и система уровней (раздел 5.3).
 */

export type EntityId = string;

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

export interface Project {
  meta: ProjectMeta;
  siteSize: { width: number; depth: number };
  levels: Record<EntityId, Level>;
}
