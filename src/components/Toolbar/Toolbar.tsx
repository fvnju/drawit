import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  Pen,
  Type,
  Hand,
} from "lucide-react";
import { useCanvasStore } from "../../stores/canvasStore";
import { ToolButton } from "./ToolButton";
import type { DrawingTool } from "../../types/canvas";

export const Toolbar = () => {
  const { tool, setTool } = useCanvasStore();

  const tools: { id: DrawingTool; icon: any; tooltip: string }[] = [
    { id: "select", icon: MousePointer2, tooltip: "Select (V)" },
    { id: "rectangle", icon: Square, tooltip: "Rectangle (R)" },
    { id: "ellipse", icon: Circle, tooltip: "Ellipse (O)" },
    { id: "line", icon: Minus, tooltip: "Line (L)" },
    { id: "pen", icon: Pen, tooltip: "Pen (P)" },
    { id: "text", icon: Type, tooltip: "Text (T)" },
    { id: "hand", icon: Hand, tooltip: "Hand Tool (H)" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--bg-toolbar)",
        padding: "8px",
        borderRadius: "12px",
        display: "flex",
        gap: "4px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 100,
      }}
    >
      {tools.map((t) => (
        <ToolButton
          key={t.id}
          icon={t.icon}
          active={tool === t.id}
          onClick={() => setTool(t.id)}
          tooltip={t.tooltip}
        />
      ))}
    </div>
  );
};
