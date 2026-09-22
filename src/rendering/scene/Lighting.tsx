/**
 * Базовое освещение сцены: направленный солнечный свет с тенями и
 * мягкий заполняющий свет. См. SPEC.md, раздел 12.3.
 */
export function Lighting() {
  return (
    <>
      <hemisphereLight args={["#e8f0ff", "#4a5a4d", 0.4]} />
      <directionalLight
        position={[15, 22, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
    </>
  );
}
