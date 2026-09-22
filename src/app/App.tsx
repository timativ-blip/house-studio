import { Canvas } from "@react-three/fiber";
import { Scene } from "@/rendering/scene/Scene";
import { CameraRig } from "@/rendering/camera/CameraRig";
import { TopBar } from "@/presentation/layout/TopBar";

export function App() {
  return (
    <div className="app-root">
      <TopBar />
      <Canvas className="viewport" shadows>
        <CameraRig />
        <Scene />
      </Canvas>
    </div>
  );
}
