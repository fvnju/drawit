import React from "react";
import type { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  tooltip: string;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  active,
  onClick,
  tooltip,
}) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        background: active ? "var(--bg-active)" : "transparent",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "white" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon size={20} />
    </button>
  );
};
