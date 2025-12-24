import { useEffect } from "react";
import { Canvas } from "./components/Canvas/Canvas";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { useCanvasStore } from "./stores/canvasStore";
import { saveProject, loadProject } from "./db/database";

import { useKeyboard } from "./hooks/useKeyboard";

function App() {
  const { setCanvasData } = useCanvasStore();
  useKeyboard();

  useEffect(() => {
    // Load data on startup
    const load = async () => {
      try {
        const data = await loadProject();
        if (data) {
          setCanvasData({
            layers: data.layers,
            objects: data.objects,
            activeLayerId: data.activeLayerId,
          });
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      }
    };
    load();
  }, [setCanvasData]);

  useEffect(() => {
    // Auto-save subscription
    // We subscribe to the store and save relevant parts
    const unsub = useCanvasStore.subscribe((state) => {
      saveProject({
        layers: state.layers,
        objects: state.objects,
        activeLayerId: state.activeLayerId || "",
      });
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Canvas />
      <Toolbar />
      <Sidebar />
    </>
  );
}

export default App;
