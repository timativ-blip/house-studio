import { Ground } from "./Ground";
import { EditorGrid } from "./EditorGrid";
import { Lighting } from "./Lighting";

/**
 * Корень 3D-сцены. Преобразует состояние проекта в декларативную сцену
 * Three.js — см. SPEC.md, раздел 3 (Слой 4. Rendering). На Этапе 0 сцена
 * пуста: участок, сетка и свет, без строительных слоёв (появятся на Этапе 2).
 */
export function Scene() {
  return (
    <>
      <Lighting />
      <Ground />
      <EditorGrid />
    </>
  );
}
