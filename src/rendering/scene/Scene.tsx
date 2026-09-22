import { Ground } from "./Ground";
import { EditorGrid } from "./EditorGrid";
import { Lighting } from "./Lighting";
import { EditorHelpers } from "./EditorHelpers";

/**
 * Корень 3D-сцены. Преобразует состояние проекта в декларативную сцену
 * Three.js — см. SPEC.md, раздел 3 (Слой 4. Rendering). Строительные слои
 * (стены, полы, предметы) появятся на Этапах 2–3; пока — участок, сетка,
 * свет и raycasting-хелперы.
 */
export function Scene() {
  return (
    <>
      <Lighting />
      <Ground />
      <EditorGrid />
      <EditorHelpers />
    </>
  );
}
