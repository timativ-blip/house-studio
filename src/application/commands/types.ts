import type { Project } from "@/types/project";

/**
 * Атомарная обратимая операция изменения проекта. См. SPEC.md, раздел 15.1.
 * Реализуется с самого начала строительных инструментов, чтобы не
 * переписывать их позже ради Undo/Redo.
 */
export interface Command {
  id: string;
  label: string;
  apply(project: Project): Project;
  invert(project: Project): Project;
}
