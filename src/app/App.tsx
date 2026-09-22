import { Canvas } from "@react-three/fiber";
import { Scene } from "@/rendering/scene/Scene";
import { CameraRig } from "@/rendering/camera/CameraRig";
import { TopBar } from "@/presentation/layout/TopBar";
import { Toolbar } from "@/presentation/toolbar/Toolbar";
import { InspectorPanel } from "@/presentation/inspector/InspectorPanel";
import { BottomCatalog } from "@/presentation/catalog/BottomCatalog";
import { useEditorShortcuts } from "@/application/keyboard/useEditorShortcuts";

export function App() {
  useEditorShortcuts();

  return (
    <div className="app-root">
      <TopBar />
      <div className="app-body">
        <Toolbar />
        <div className="viewport-column">
          <Canvas className="viewport" shadows="soft" gl={{ antialias: true }}>
            <CameraRig />
            <Scene />
          </Canvas>
          <BottomCatalog />
        </div>
        <InspectorPanel />
      </div>
    </div>
  );
}
