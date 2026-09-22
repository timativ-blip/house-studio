import { EffectComposer, N8AO, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Пост-обработка: раньше плоские объекты «плавали» без контактных теней
 * между собой и полом. N8AO — приближение ambient occlusion в экранном
 * пространстве, даёт стенам и мебели визуальный вес. Bloom и Vignette —
 * лёгкие, только на самые яркие участки/края кадра, не превращают сцену
 * в аркаду. См. SPEC.md, раздел 12.4 (пресеты качества графики появятся
 * отдельно, когда будет что переключать по производительности).
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={1.2} intensity={2} distanceFalloff={1} halfRes />
      <Bloom intensity={0.25} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.15} darkness={0.4} />
    </EffectComposer>
  );
}
