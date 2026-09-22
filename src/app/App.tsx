import { Canvas } from "@react-three/fiber";
import { Scene } from "@/rendering/scene/Scene";
import { CameraRig } from "@/rendering/camera/CameraRig";
import { TopBar } from "@/presentation/layout/TopBar";
import { Toolbar } from "@/presentation/toolbar/Toolbar";
import { InspectorPanel } from "@/presentation/inspector/InspectorPanel";

export function App() {
  return (
    <div className="app-root">
      <TopBar />
      <div className="app-body">
        <Toolbar />
        <Canvas className="viewport" shadows>
          <CameraRig />
          <Scene />
        </Canvas>
        <InspectorPanel />
      </div>
    </div>
  );
}
