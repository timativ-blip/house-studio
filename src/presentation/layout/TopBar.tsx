import { useProjectStore } from "@/application/store/useProjectStore";

/**
 * Минимальная верхняя панель Этапа 0 — просто подтверждает, что
 * Presentation-слой читает состояние из Application-слоя (Zustand),
 * а не хранит его сам. Полная панель — SPEC.md, раздел 17.2.
 */
export function TopBar() {
  const projectName = useProjectStore((s) => s.project.meta.name);

  return (
    <header className="top-bar">
      <span className="top-bar__title">House Studio</span>
      <span className="top-bar__project">{projectName}</span>
    </header>
  );
}
