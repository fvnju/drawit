import { useCanvasStore } from "../../stores/canvasStore";
import { LayerItem } from "./LayerItem";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const LayerPanel = () => {
  const { layers, activeLayerId, setActiveLayer, addLayer, reorderLayers } =
    useCanvasStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id);
      const newIndex = layers.findIndex((layer) => layer.id === over.id);

      reorderLayers(oldIndex, newIndex);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid var(--border-default)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          fontSize: "12px",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
        }}
      >
        LAYERS
        <button
          onClick={addLayer}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
          }}
          title="Add New Layer"
        >
          <Plus size={16} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layers.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {layers.map((layer) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isActive={activeLayerId === layer.id}
                onSelect={() => setActiveLayer(layer.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
