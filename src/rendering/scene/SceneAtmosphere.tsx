import { Sky } from "@react-three/drei";

const SUN_POSITION: [number, number, number] = [15, 22, 10];

/**
 * Небо: раньше сцена рендерилась на сплошном тёмном фоне без горизонта.
 * Sky — процедурное небо (модель Прейтема) с тем же направлением солнца,
 * что и directional light в Lighting.tsx. Низкая turbidity даёт чистое
 * голубое небо; высокая делает его белёсым/мутным. Environment (IBL для
 * отражений) сознательно не подключён — единственный доступный пресет
 * зависит от внешнего CDN, а до появления пайплайна текстур (раздел 19)
 * это лишняя внешняя зависимость без реальной выгоды. См. раздел 12.3.
 */
export function SceneAtmosphere() {
  return (
    <>
      <Sky
        sunPosition={SUN_POSITION}
        turbidity={2}
        rayleigh={1}
        mieCoefficient={0.003}
        mieDirectionalG={0.7}
      />
      <fog attach="fog" args={["#bcd2e0", 35, 100]} />
    </>
  );
}
