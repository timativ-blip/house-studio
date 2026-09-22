import {
  MousePointer2,
  RectangleHorizontal,
  Frame,
  LayoutGrid,
  DoorOpen,
  Sofa,
  Trees,
  Palette,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useProjectStore, type ToolId } from "@/application/store/useProjectStore";

interface ImplementedToolDef {
  key: string;
  toolId: ToolId;
  label: string;
  icon: LucideIcon;
}

interface PlannedToolDef {
  key: string;
  toolId?: undefined;
  label: string;
  icon: LucideIcon;
}

type ToolDef = ImplementedToolDef | PlannedToolDef;

// Полный список инструментов из SPEC.md, раздел 17.3. Реально работают
// "Выделение", "Стены", "Комнаты", "Мебель" и "Ландшафт" — остальные
// появятся на Этапе 4–5 и лишь помечены как недоступные, без вида рабочей
// кнопки (правило № 4).
const TOOLS: ToolDef[] = [
  { key: "select", toolId: "select", label: "Выделение", icon: MousePointer2 },
  { key: "wall", toolId: "wall", label: "Стены", icon: RectangleHorizontal },
  { key: "room", toolId: "room", label: "Комнаты", icon: Frame },
  { key: "floor", label: "Полы", icon: LayoutGrid },
  { key: "openings", label: "Двери и окна", icon: DoorOpen },
  { key: "furniture", toolId: "furniture", label: "Мебель", icon: Sofa },
  { key: "landscape", toolId: "landscape", label: "Ландшафт", icon: Trees },
  { key: "materials", label: "Материалы", icon: Palette },
  { key: "delete", label: "Удаление", icon: Trash2 },
];

export function Toolbar() {
  const activeTool = useProjectStore((s) => s.activeTool);
  const setActiveTool = useProjectStore((s) => s.setActiveTool);

  return (
    <nav className="toolbar" aria-label="Инструменты редактора">
      {TOOLS.map(({ key, toolId, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className="toolbar__button"
          data-active={toolId !== undefined && activeTool === toolId}
          disabled={toolId === undefined}
          title={toolId === undefined ? `${label} (скоро)` : label}
          onClick={() => toolId && setActiveTool(toolId)}
        >
          <Icon size={20} strokeWidth={1.75} />
        </button>
      ))}
    </nav>
  );
}
