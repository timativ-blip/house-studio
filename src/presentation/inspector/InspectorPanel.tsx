import { useProjectStore } from "@/application/store/useProjectStore";

/**
 * Правая панель. Пока нет выделяемых объектов (появятся на Этапе 2),
 * показывает параметры участка и координаты привязанного к сетке курсора —
 * см. SPEC.md, раздел 17.4: «при отсутствии выделения можно показывать
 * свойства участка».
 */
export function InspectorPanel() {
  const siteSize = useProjectStore((s) => s.project.siteSize);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);

  return (
    <aside className="inspector">
      <h2 className="inspector__title">Участок</h2>
      <dl className="inspector__fields">
        <div className="inspector__field">
          <dt>Размер</dt>
          <dd>
            {siteSize.width} × {siteSize.depth} м
          </dd>
        </div>
        <div className="inspector__field">
          <dt>Курсор</dt>
          <dd>{cursorPoint ? `X: ${cursorPoint.x} м, Z: ${cursorPoint.z} м` : "—"}</dd>
        </div>
      </dl>
    </aside>
  );
}
