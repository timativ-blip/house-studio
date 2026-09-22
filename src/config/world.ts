/**
 * Константы строительного мира, см. SPEC.md, раздел 5.1.
 * Единая точка правды — не дублировать эти числа в другом коде.
 */
export const WORLD_CONFIG = {
  /** Размер участка в метрах (X × Z). */
  siteSize: { width: 40, depth: 40 },
  /** Шаг привязки к сетке, метры. */
  gridStep: 0.5,
  /** Высота стены по умолчанию, метры. */
  defaultWallHeight: 2.8,
  /** Толщина стены по умолчанию, метры. */
  defaultWallThickness: 0.2,
} as const;

export const CURRENT_PROJECT_FORMAT_VERSION = "0.1.0";
