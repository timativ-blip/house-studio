import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/**
 * Камера режима строительства (см. SPEC.md, раздел 13).
 * Левая кнопка мыши намеренно не привязана к камере — она зарезервирована
 * за инструментами редактора (выделение, строительство).
 */
export function CameraRig() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[18, 16, 18]} fov={45} near={0.1} far={200} />
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={3}
        maxDistance={80}
        mouseButtons={{
          LEFT: null as unknown as THREE.MOUSE,
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </>
  );
}
