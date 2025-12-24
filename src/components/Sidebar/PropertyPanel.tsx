import { useCanvasStore } from "../../stores/canvasStore";
import type { CanvasObject } from "../../types/canvas";
import { RotateCw, Droplets } from "lucide-react";

const CompactProperty = ({
  label,
  children,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      backgroundColor: "var(--bg-canvas)",
      border: "1px solid var(--border-default)",
      borderRadius: "6px",
      padding: "2px 6px",
      height: "32px",
      transition: "border-color 0.2s ease",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        color: "var(--text-tertiary)",
        fontSize: "10px",
        fontWeight: 600,
        minWidth: "12px",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
      }}
    >
      {label}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const PropertyRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontSize: "12px",
      height: "28px",
    }}
  >
    <label style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
      {label}
    </label>
    <div style={{ width: "60%" }}>{children}</div>
  </div>
);

const Input = ({ value, onChange, type = "text", ...props }: any) => (
  <input
    value={value}
    onChange={onChange}
    type={type}
    style={{
      width: "100%",
      backgroundColor: "transparent",
      border: "none",
      padding: "0",
      color: "var(--text-primary)",
      fontSize: "12px",
      outline: "none",
      height: "100%",
      fontFamily: "inherit",
    }}
    {...props}
  />
);

const BorderedInput = ({ value, onChange, type = "text", ...props }: any) => (
  <input
    value={value}
    onChange={onChange}
    type={type}
    style={{
      width: "100%",
      backgroundColor: "var(--bg-canvas)",
      border: "1px solid var(--border-default)",
      borderRadius: "6px",
      padding: "6px 8px",
      color: "var(--text-primary)",
      fontSize: "12px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    }}
    onFocus={(e) => (e.target.style.borderColor = "var(--accent-primary)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
    {...props}
  />
);

const ColorInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => (
  <div
    style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
      width: "100%",
    }}
  >
    {/* Native color picker - works reliably on all platforms */}
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "28px",
        height: "28px",
        padding: 0,
        border: "1px solid var(--border-default)",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: "transparent",
      }}
    />
    <div style={{ flex: 1 }}>
      <BorderedInput
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export const PropertyPanel = () => {
  const { selectedObjectIds, objects, updateObject } = useCanvasStore();

  if (selectedObjectIds.length === 0) {
    return (
      <div
        style={{
          padding: "32px 20px",
          color: "var(--text-tertiary)",
          fontSize: "13px",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Select an object to edit properties
      </div>
    );
  }

  const objectId = selectedObjectIds[0];
  const object = objects[objectId];

  if (!object) return null;

  const handleChange = (key: keyof CanvasObject, value: any) => {
    updateObject(objectId, { [key]: value });
  };

  const handleNumberChange = (key: keyof CanvasObject, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      handleChange(key, num);
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-panel)",
        overflowY: "auto",
        overflowX: "hidden", // Prevent horizontal scroll
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "16px",
          fontWeight: 600,
          fontSize: "11px",
          color: "var(--text-secondary)",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        Properties
      </div>

      {/* Geometry Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <CompactProperty label="X">
          <Input
            value={Math.round(object.x)}
            onChange={(e: any) => handleNumberChange("x", e.target.value)}
          />
        </CompactProperty>
        <CompactProperty label="Y">
          <Input
            value={Math.round(object.y)}
            onChange={(e: any) => handleNumberChange("y", e.target.value)}
          />
        </CompactProperty>

        {(object.type === "rectangle" || object.type === "ellipse") && (
          <>
            <CompactProperty label="W">
              <Input
                value={Math.round(object.width || 0)}
                onChange={(e: any) =>
                  handleNumberChange("width", e.target.value)
                }
              />
            </CompactProperty>
            <CompactProperty label="H">
              <Input
                value={Math.round(object.height || 0)}
                onChange={(e: any) =>
                  handleNumberChange("height", e.target.value)
                }
              />
            </CompactProperty>
          </>
        )}

        <CompactProperty label={<RotateCw size={12} />}>
          <Input
            value={Math.round(object.rotation || 0)}
            onChange={(e: any) =>
              handleNumberChange("rotation", e.target.value)
            }
          />
        </CompactProperty>
        <CompactProperty label={<Droplets size={12} />}>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={object.opacity}
            onChange={(e: any) => handleNumberChange("opacity", e.target.value)}
          />
        </CompactProperty>
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: "var(--border-default)",
          marginBottom: "20px",
        }}
      />

      {/* Style Props */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {object.fill !== undefined && (
          <PropertyRow label="Fill">
            <ColorInput
              value={object.fill}
              onChange={(e: any) => handleChange("fill", e.target.value)}
            />
          </PropertyRow>
        )}

        {object.stroke !== undefined && (
          <PropertyRow label="Stroke">
            <ColorInput
              value={object.stroke}
              onChange={(e: any) => handleChange("stroke", e.target.value)}
            />
          </PropertyRow>
        )}

        {object.strokeWidth !== undefined && (
          <PropertyRow label="Thickness">
            <BorderedInput
              type="number"
              min="0"
              value={object.strokeWidth}
              onChange={(e: any) =>
                handleNumberChange("strokeWidth", e.target.value)
              }
            />
          </PropertyRow>
        )}

        {object.fontSize !== undefined && (
          <PropertyRow label="Font Size">
            <BorderedInput
              type="number"
              min="1"
              value={object.fontSize}
              onChange={(e: any) =>
                handleNumberChange("fontSize", e.target.value)
              }
            />
          </PropertyRow>
        )}
      </div>
    </div>
  );
};
