import { RaycastPlane } from "@/rendering/helpers/RaycastPlane";
import { SnapCursor } from "@/rendering/helpers/SnapCursor";

/**
 * Вспомогательные элементы редактора: не сохраняются в проект.
 * См. SPEC.md, раздел 12.1 (EditorHelpers в дереве сцены).
 */
export function EditorHelpers() {
  return (
    <>
      <RaycastPlane />
      <SnapCursor />
    </>
  );
}
