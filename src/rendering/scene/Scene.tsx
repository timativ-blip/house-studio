import { Ground } from "./Ground";
import { EditorGrid } from "./EditorGrid";
import { Lighting } from "./Lighting";
import { EditorHelpers } from "./EditorHelpers";
import { WallsLayer } from "./WallsLayer";
import { FloorsLayer } from "./FloorsLayer";
import { ItemsLayer } from "./ItemsLayer";
import { PathsLayer } from "./PathsLayer";

/**
 * Корень 3D-сцены. Преобразует состояние проекта в декларативную сцену
 * Three.js — см. SPEC.md, раздел 3 (Слой 4. Rendering).
 */
export function Scene() {
  return (
    <>
      <Lighting />
      <Ground />
      <EditorGrid />
      <FloorsLayer />
      <WallsLayer />
      <PathsLayer />
      <ItemsLayer />
      <EditorHelpers />
    </>
  );
}
