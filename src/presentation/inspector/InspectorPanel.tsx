import { useProjectStore } from "@/application/store/useProjectStore";
import { wallLength } from "@/domain/walls/wallGeometry";
import { getMaterialsByCategory, type MaterialDefinition } from "@/rendering/materials/catalog";
import { Trash2 } from "lucide-react";

function MaterialSwatches({
  category,
  activeId,
  onPick,
}: {
  category: MaterialDefinition["category"];
  activeId: string;
  onPick: (materialId: string) => void;
}) {
  const materials = getMaterialsByCategory(category);
  return (
    <div className="inspector__swatches">
      {materials.map((material) => (
        <button
          key={material.id}
          type="button"
          className="inspector__swatch"
          data-active={material.id === activeId}
          title={material.name}
          style={{ background: material.baseColor }}
          onClick={() => onPick(material.id)}
        />
      ))}
    </div>
  );
}

function WallInspector({ wallId }: { wallId: string }) {
  const wall = useProjectStore((s) => s.project.entities.walls[wallId]);
  const setWallMaterial = useProjectStore((s) => s.setWallMaterial);
  const deleteSelected = useProjectStore((s) => s.deleteSelected);

  if (!wall) return null;

  return (
    <>
      <h2 className="inspector__title">Стена</h2>
      <dl className="inspector__fields">
        <div className="inspector__field">
          <dt>Длина</dt>
          <dd>{wallLength(wall.start, wall.end).toFixed(2)} м</dd>
        </div>
        <div className="inspector__field">
          <dt>Высота</dt>
          <dd>{wall.height.toFixed(2)} м</dd>
        </div>
        <div className="inspector__field">
          <dt>Толщина</dt>
          <dd>{wall.thickness.toFixed(2)} м</dd>
        </div>
        <div className="inspector__field">
          <dt>Материал (снаружи)</dt>
          <MaterialSwatches
            category="wall"
            activeId={wall.materialId.exterior}
            onPick={(id) => setWallMaterial(wall.id, "exterior", id)}
          />
        </div>
        <div className="inspector__field">
          <dt>Материал (внутри)</dt>
          <MaterialSwatches
            category="wall"
            activeId={wall.materialId.interior}
            onPick={(id) => setWallMaterial(wall.id, "interior", id)}
          />
        </div>
      </dl>
      <button type="button" className="inspector__delete" onClick={deleteSelected}>
        <Trash2 size={16} /> Удалить стену
      </button>
    </>
  );
}

function FloorInspector({ floorId }: { floorId: string }) {
  const floor = useProjectStore((s) => s.project.entities.floors[floorId]);
  const setFloorMaterial = useProjectStore((s) => s.setFloorMaterial);
  const deleteSelected = useProjectStore((s) => s.deleteSelected);

  if (!floor) return null;

  return (
    <>
      <h2 className="inspector__title">Пол</h2>
      <dl className="inspector__fields">
        <div className="inspector__field">
          <dt>Толщина</dt>
          <dd>{floor.thickness.toFixed(2)} м</dd>
        </div>
        <div className="inspector__field">
          <dt>Материал</dt>
          <MaterialSwatches
            category="floor"
            activeId={floor.materialId}
            onPick={(id) => setFloorMaterial(floor.id, id)}
          />
        </div>
      </dl>
      <button type="button" className="inspector__delete" onClick={deleteSelected}>
        <Trash2 size={16} /> Удалить пол
      </button>
    </>
  );
}

function SiteInspector() {
  const siteSize = useProjectStore((s) => s.project.siteSize);
  const cursorPoint = useProjectStore((s) => s.cursorPoint);
  const activeTool = useProjectStore((s) => s.activeTool);

  const hint =
    activeTool === "wall"
      ? "Клик — начать стену, клик ещё раз — завершить. Esc — отмена."
      : activeTool === "room"
        ? "Клик — первый угол комнаты, клик ещё раз — противоположный угол. Esc — отмена."
        : "Выберите стену или пол на сцене, чтобы увидеть их свойства.";

  return (
    <>
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
      <p className="inspector__hint">{hint}</p>
    </>
  );
}

/**
 * Правая панель. При выделении стены/пола показывает их параметры,
 * материалы и удаление (SPEC.md, раздел 17.4); иначе — параметры участка
 * и подсказку по активному инструменту.
 */
export function InspectorPanel() {
  const selectedEntityRef = useProjectStore((s) => s.selectedEntityRef);

  return (
    <aside className="inspector">
      {selectedEntityRef?.kind === "wall" && <WallInspector wallId={selectedEntityRef.id} />}
      {selectedEntityRef?.kind === "floor" && <FloorInspector floorId={selectedEntityRef.id} />}
      {!selectedEntityRef && <SiteInspector />}
    </aside>
  );
}
