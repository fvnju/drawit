import { useState } from "react";
import { LayerPanel } from "./LayerPanel";
import { PropertyPanel } from "./PropertyPanel";
import { ChevronRight, Layers } from "lucide-react";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "240px",
          backgroundColor: "var(--bg-panel)",
          borderLeft: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          zIndex: 110, // Above toolbar (100)
          transform: isCollapsed ? "translateX(100%)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isCollapsed ? "none" : "-4px 0 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: "absolute",
            left: "-32px",
            top: "20px",
            width: "32px",
            height: "32px",
            backgroundColor: "var(--bg-panel)",
            border: "1px solid var(--border-default)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: 0,
          }}
          title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
        >
          {isCollapsed ? <Layers size={18} /> : <ChevronRight size={18} />}
        </button>

        <div
          style={{
            flex: 1,
            minHeight: "200px", // Give it some base height
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <LayerPanel />
        </div>
        <div
          style={{
            // Allow property panel to take space but not overflow
            flexShrink: 0,
            maxHeight: "50%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <PropertyPanel />
        </div>
      </div>
    </>
  );
};
