import { useEffect, useRef, type RefObject } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const AZIMUTH_SPEED = 1.4; // рад/с
const POLAR_SPEED = 1.0; // рад/с

interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

function orbitBy(controls: OrbitControlsImpl, deltaTheta: number, deltaPhi: number) {
  const camera = controls.object;
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += deltaTheta;
  spherical.phi = THREE.MathUtils.clamp(
    spherical.phi + deltaPhi,
    controls.minPolarAngle,
    controls.maxPolarAngle,
  );
  offset.setFromSpherical(spherical);
  camera.position.copy(controls.target).add(offset);
  camera.lookAt(controls.target);
}

/**
 * Клавиатурное вращение камеры вокруг цели: стрелки влево/вправо —
 * азимут, вверх/вниз — наклон. Дополняет мышь (раздел 13.1), не заменяет
 * её — зажатая клавиша вращает камеру плавно, кадр за кадром.
 */
function useKeyboardOrbit(controlsRef: RefObject<OrbitControlsImpl | null>) {
  const keys = useRef<KeyState>({ left: false, right: false, up: false, down: false });

  useEffect(() => {
    function setKey(key: string, value: boolean): boolean {
      switch (key) {
        case "ArrowLeft":
          keys.current.left = value;
          return true;
        case "ArrowRight":
          keys.current.right = value;
          return true;
        case "ArrowUp":
          keys.current.up = value;
          return true;
        case "ArrowDown":
          keys.current.down = value;
          return true;
        default:
          return false;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (setKey(event.key, true)) event.preventDefault();
    }

    function onKeyUp(event: KeyboardEvent) {
      setKey(event.key, false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const { left, right, up, down } = keys.current;
    if (!left && !right && !up && !down) return;

    const deltaTheta = (right ? -AZIMUTH_SPEED : 0) + (left ? AZIMUTH_SPEED : 0);
    const deltaPhi = (down ? POLAR_SPEED : 0) + (up ? -POLAR_SPEED : 0);
    orbitBy(controls, deltaTheta * delta, deltaPhi * delta);
    controls.update();
  });
}

/**
 * Камера режима строительства (см. SPEC.md, раздел 13).
 * Левая кнопка мыши намеренно не привязана к камере — она зарезервирована
 * за инструментами редактора (выделение, строительство).
 */
export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  useKeyboardOrbit(controlsRef);

  return (
    <>
      <PerspectiveCamera makeDefault position={[18, 16, 18]} fov={45} near={0.1} far={200} />
      <OrbitControls
        ref={controlsRef}
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
