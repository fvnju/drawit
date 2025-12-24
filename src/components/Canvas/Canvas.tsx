import { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer as KonvaLayer,
  Rect,
  Ellipse,
  Line,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import { useCanvasStore } from "../../stores/canvasStore";
import type { CanvasObject } from "../../types/canvas";
import type { KonvaEventObject } from "konva/lib/Node";
import { getBoundingBox, doRectanglesIntersect } from "../../utils/geometry";

const ObjectRenderer = ({
  object,
  isSelected,
  onSelect,
  onUpdate,
}: {
  object: CanvasObject;
  isSelected: boolean;
  onSelect: (multi: boolean) => void;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    id: object.id,
    x: object.x,
    y: object.y,
    rotation: object.rotation,
    opacity: object.opacity,
    draggable: isSelected,
    onClick: (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      onSelect(e.evt.shiftKey);
    },
    onTap: (e: KonvaEventObject<TouchEvent>) => {
      e.cancelBubble = true;
      onSelect(false); // Touch doesn't have shift
    },
    onDragEnd: (e: KonvaEventObject<DragEvent>) => {
      onUpdate(object.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
  };

  return (
    <>
      {object.type === "rectangle" && (
        <Rect
          ref={shapeRef}
          {...commonProps}
          width={object.width}
          height={object.height}
          fill={object.fill}
          stroke={object.stroke}
          strokeWidth={object.strokeWidth}
        />
      )}
      {object.type === "ellipse" && (
        <Ellipse
          ref={shapeRef}
          {...commonProps}
          radiusX={(object.width || 0) / 2}
          radiusY={(object.height || 0) / 2}
          fill={object.fill}
          stroke={object.stroke}
          strokeWidth={object.strokeWidth}
        />
      )}
      {(object.type === "line" || object.type === "pen") && (
        <Line
          ref={shapeRef}
          {...commonProps}
          points={object.points || []}
          stroke={object.stroke}
          strokeWidth={object.strokeWidth}
          tension={object.type === "pen" ? 0.5 : 0}
          lineCap="round"
          lineJoin="round"
          hitStrokeWidth={20} // Larger hit area for easier selection
          draggable={true} // Always draggable, selection happens on click
        />
      )}
      {object.type === "text" && (
        <KonvaText
          ref={shapeRef}
          {...commonProps}
          text={object.text || "Text"}
          fontSize={object.fontSize || 20}
          fill={object.fill}
          fontFamily="Inter, sans-serif"
          onDblClick={() => {
            const newText = prompt("Edit text:", object.text);
            if (newText !== null) {
              onUpdate(object.id, { text: newText });
            }
          }}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (node) {
              onUpdate(object.id, {
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * node.scaleX()),
                height: Math.max(5, node.height() * node.scaleY()),
                rotation: node.rotation(),
              });
              // Reset scale to 1 to avoid compounding checks
              node.scaleX(1);
              node.scaleY(1);
            }
          }}
        />
      )}
    </>
  );
};

export const Canvas = () => {
  const {
    layers,
    objects,
    selectedObjectIds,
    selectObject,
    deselectAll,
    addObject,
    updateObject,
    tool,
  } = useCanvasStore();
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Selection Box State
  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === "select") {
      const clickedOnEmpty = e.target === stage;
      if (clickedOnEmpty) {
        deselectAll();
        // Start selection rectangle
        setIsDrawing(true);
        setStartPos({ x: pos.x, y: pos.y });
        setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
      }
      return;
    }

    if (tool === "hand") return;

    if (tool === "text") {
      addObject({
        type: "text",
        x: pos.x,
        y: pos.y,
        text: "Type something...",
        fontSize: 20,
        fill: "#ffffff",
        opacity: 1,
        rotation: 0,
      });
      return;
    }

    if (
      tool === "rectangle" ||
      tool === "ellipse" ||
      tool === "line" ||
      tool === "pen"
    ) {
      setIsDrawing(true);
      setStartPos({ x: pos.x, y: pos.y });

      let initialObject: any = {
        type: tool,
        x: pos.x,
        y: pos.y,
        stroke: "#000000",
        strokeWidth: 2,
        opacity: 1,
        rotation: 0,
      };

      if (tool === "rectangle" || tool === "ellipse") {
        initialObject.width = 0;
        initialObject.height = 0;
        initialObject.fill = "#D9D9D9";
      } else if (tool === "line") {
        initialObject.points = [0, 0, 0, 0];
        initialObject.x = pos.x;
        initialObject.y = pos.y;
      } else if (tool === "pen") {
        initialObject.points = [0, 0];
        initialObject.x = pos.x;
        initialObject.y = pos.y;
      }

      const id = addObject(initialObject);
      setCurrentShapeId(id);
    }
  };

  const handleMouseMove = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === "select" && selectionRect) {
      setSelectionRect({
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
      });
      return;
    }

    if (!currentShapeId) return;

    // ... Drawing tools logic ...
    if (tool === "rectangle" || tool === "ellipse") {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;

      updateObject(currentShapeId, {
        width: Math.abs(width),
        height: Math.abs(height),
        x: width > 0 ? startPos.x : pos.x,
        y: height > 0 ? startPos.y : pos.y,
      });
    } else if (tool === "line") {
      const relativeX = pos.x - startPos.x;
      const relativeY = pos.y - startPos.y;
      updateObject(currentShapeId, {
        points: [0, 0, relativeX, relativeY],
      });
    } else if (tool === "pen") {
      const relativeX = pos.x - startPos.x;
      const relativeY = pos.y - startPos.y;

      const currentObj = useCanvasStore.getState().objects[currentShapeId];
      if (currentObj && currentObj.points) {
        updateObject(currentShapeId, {
          points: [...currentObj.points, relativeX, relativeY],
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      if (tool === "select" && selectionRect) {
        // Find intersecting objects
        const selected: string[] = [];
        Object.values(objects).forEach((obj) => {
          const layer = layers.find((l) => l.children.includes(obj.id));
          if (!layer || !layer.visible || layer.locked) return; // Skip invisible/locked

          if (doRectanglesIntersect(selectionRect, getBoundingBox(obj))) {
            selected.push(obj.id);
          }
        });

        // Deselect all first, then select only the found items
        deselectAll();
        selected.forEach((id) => selectObject(id, true)); // true for multi-select within marquee

        setSelectionRect(null);
      }

      setIsDrawing(false);
      if (currentShapeId) {
        selectObject(currentShapeId);
      }
      setCurrentShapeId(null);
    }
  };

  return (
    <div
      className="canvas-container"
      style={{
        backgroundColor: "var(--bg-canvas)",
        cursor: tool === "hand" ? "grab" : "default",
      }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        draggable={tool === "hand"}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        {layers.map((layer) => {
          if (!layer.visible) return null;
          return (
            <KonvaLayer key={layer.id} opacity={layer.opacity}>
              {layer.children.map((childId) => {
                const obj = objects[childId];
                if (!obj) return null;
                return (
                  <ObjectRenderer
                    key={childId}
                    object={obj}
                    isSelected={selectedObjectIds.includes(childId)}
                    onSelect={(multi) => selectObject(childId, multi)}
                    onUpdate={updateObject}
                  />
                );
              })}
            </KonvaLayer>
          );
        })}
        {/* Selection Rectangle Layer - Top Most */}
        {selectionRect && (
          <KonvaLayer>
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(13, 153, 255, 0.1)"
              stroke="rgba(13, 153, 255, 0.5)"
              strokeWidth={1}
              listening={false} // Click through
            />
          </KonvaLayer>
        )}
      </Stage>
    </div>
  );
};
