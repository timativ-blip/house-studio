import { useProjectStore } from "@/application/store/useProjectStore";
import { getCatalogByCategory } from "@/rendering/catalog/items";

/**
 * Контекстный каталог снизу экрана (SPEC.md, раздел 17.5): при инструменте
 * "Мебель" показывает мебель, при "Ландшафт" — растения/декор и переключатель
 * на построение дорожки (раздел 11.2). Одна панель обслуживает оба
 * инструмента, различие — в её содержимом.
 */
export function BottomCatalog() {
  const activeTool = useProjectStore((s) => s.activeTool);
  const catalogSelection = useProjectStore((s) => s.catalogSelection);
  const setCatalogSelection = useProjectStore((s) => s.setCatalogSelection);
  const landscapeMode = useProjectStore((s) => s.landscapeMode);
  const setLandscapeMode = useProjectStore((s) => s.setLandscapeMode);

  if (activeTool !== "furniture" && activeTool !== "landscape") return null;

  const items = getCatalogByCategory(activeTool === "furniture" ? "furniture" : "landscape");

  return (
    <div className="bottom-catalog">
      {activeTool === "landscape" && (
        <div className="bottom-catalog__modes">
          <button
            type="button"
            className="bottom-catalog__mode"
            data-active={landscapeMode === "objects"}
            onClick={() => setLandscapeMode("objects")}
          >
            Объекты
          </button>
          <button
            type="button"
            className="bottom-catalog__mode"
            data-active={landscapeMode === "path"}
            onClick={() => setLandscapeMode("path")}
          >
            Дорожка
          </button>
        </div>
      )}
      {(activeTool === "furniture" || landscapeMode === "objects") && (
        <div className="bottom-catalog__items">
          {items.map((item) => (
            <button
              key={item.assetId}
              type="button"
              className="bottom-catalog__item"
              data-active={catalogSelection?.assetId === item.assetId}
              onClick={() => setCatalogSelection({ category: item.category, assetId: item.assetId })}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
