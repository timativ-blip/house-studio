import { RaycastPlane } from "@/rendering/helpers/RaycastPlane";
import { SnapCursor } from "@/rendering/helpers/SnapCursor";
import { WallPreview } from "@/rendering/helpers/WallPreview";
import { RoomPreview } from "@/rendering/helpers/RoomPreview";

/**
 * Вспомогательные элементы редактора: не сохраняются в проект.
 * См. SPEC.md, раздел 12.1 (EditorHelpers в дереве сцены).
 */
export function EditorHelpers() {
  return (
    <>
      <RaycastPlane />
      <SnapCursor />
      <WallPreview />
      <RoomPreview />
    </>
  );
}
