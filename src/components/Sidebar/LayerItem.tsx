import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCanvasStore } from "../../stores/canvasStore";
import type { Layer } from "../../types/canvas";

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  onSelect: () => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isActive,
  onSelect,
}) => {
  const {
    toggleLayerVisibility,
    toggleLayerLock,
    removeLayer,
    objects,
    selectObject,
    selectedObjectIds,
  } = useCanvasStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as const,
  };

  const handleObjectSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    selectObject(id);
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Layer Header */}
      <div
        onClick={onSelect}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 4px 8px 0", // Adjusted padding
          backgroundColor: isActive ? "var(--bg-active)" : "transparent",
          borderBottom: "1px solid var(--border-default)",
          cursor: "pointer",
          color: isActive ? "white" : "var(--text-primary)",
          fontSize: "14px",
          userSelect: "none",
        }}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            padding: "0 4px",
            cursor: "grab",
            color: "var(--text-tertiary)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <GripVertical size={14} />
        </div>

        {/* Expand Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            opacity: layer.children.length > 0 ? 1 : 0.3,
          }}
          disabled={layer.children.length === 0}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 500,
            marginLeft: "4px",
          }}
        >
          {layer.name}
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(layer.id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              opacity: 0.7,
            }}
          >
            {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerLock(layer.id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              opacity: 0.7,
            }}
          >
            {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeLayer(layer.id);
            }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              opacity: 0.7,
            }}
            title="Delete Layer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Children List */}
      {isExpanded && layer.children.length > 0 && (
        <div style={{ backgroundColor: "var(--bg-panel)" }}>
          {layer.children
            .slice()
            .reverse()
            .map((childId) => {
              const obj = objects[childId];
              if (!obj) return null;
              const isObjSelected = selectedObjectIds.includes(childId);

              const getIcon = () => {
                switch (obj.type) {
                  case "text":
                    return "T";
                  case "rectangle":
                    return "□";
                  case "ellipse":
                    return "○";
                  case "line":
                    return "/";
                  case "pen":
                    return "✎";
                  default:
                    return "•";
                }
              };

              return (
                <div
                  key={childId}
                  onClick={(e) => handleObjectSelect(e, childId)}
                  style={{
                    padding: "6px 12px 6px 40px", // Indent for children
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: isObjSelected
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)",
                    backgroundColor: isObjSelected
                      ? "rgba(13, 153, 255, 0.1)"
                      : "transparent",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      width: "16px",
                      textAlign: "center",
                    }}
                  >
                    {getIcon()}
                  </span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {obj.text ||
                      `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}`}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
