# DrawIt - Implementation Plan

A Figma-inspired drawing application built with React, Konva, and TypeScript.

---

## Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | React 19 + TypeScript        |
| Build Tool       | Vite                         |
| Canvas Library   | Konva + react-konva          |
| State Management | Zustand                      |
| Storage          | **IndexedDB** (via Dexie.js) |
| Styling          | CSS Modules                  |
| Icons            | Lucide React                 |
| ID Generation    | nanoid                       |

### Why IndexedDB over localStorage?

| Feature       | IndexedDB                  | localStorage              |
| ------------- | -------------------------- | ------------------------- |
| Storage Limit | ~50MB+ (browser dependent) | ~5MB                      |
| Data Types    | Binary, Blobs, Objects     | Strings only              |
| Performance   | Async (non-blocking)       | Sync (blocks main thread) |
| Structure     | Indexed, queryable         | Key-value only            |

**Recommendation: IndexedDB** - Drawing apps generate large canvas data, images, and complex layer structures that will quickly exceed localStorage limits. Dexie.js provides a clean Promise-based API over IndexedDB.

---

## Architecture Overview

```
src/
├── components/
│   ├── Canvas/
│   │   ├── Canvas.tsx              # Main Konva Stage wrapper
│   │   ├── CanvasLayer.tsx         # Individual layer renderer
│   │   └── CanvasObjects.tsx       # Shape/drawing objects
│   ├── Toolbar/
│   │   ├── Toolbar.tsx             # Bottom toolbar container
│   │   ├── ToolButton.tsx          # Individual tool button
│   │   └── tools/                  # Tool-specific UI components
│   ├── Sidebar/
│   │   ├── Sidebar.tsx             # Right sidebar container
│   │   ├── LayerPanel.tsx          # Layer list and controls
│   │   ├── LayerItem.tsx           # Individual layer row
│   │   └── PropertyPanel.tsx       # Selected object properties
│   └── shared/
│       ├── ColorPicker.tsx
│       ├── Slider.tsx
│       └── Tooltip.tsx
├── hooks/
│   ├── useCanvas.ts                # Canvas interaction logic
│   ├── useTool.ts                  # Active tool handling
│   ├── useKeyboard.ts              # Keyboard shortcuts
│   └── useHistory.ts               # Undo/redo functionality
├── stores/
│   ├── canvasStore.ts              # Canvas state (layers, objects)
│   ├── toolStore.ts                # Active tool, tool settings
│   ├── uiStore.ts                  # UI state (panels, modals)
│   └── historyStore.ts             # Undo/redo state
├── db/
│   ├── database.ts                 # Dexie database setup
│   ├── projectService.ts           # CRUD for projects
│   └── types.ts                    # Database types
├── types/
│   ├── canvas.ts                   # Canvas/layer/object types
│   ├── tools.ts                    # Tool types
│   └── project.ts                  # Project types
├── utils/
│   ├── geometry.ts                 # Math/geometry helpers
│   ├── export.ts                   # Export to PNG/SVG
│   └── import.ts                   # Import images
├── constants/
│   └── tools.ts                    # Tool definitions
├── App.tsx
├── main.tsx
└── index.css
```

---

## Core Features

### Phase 1: Foundation

- [ ] Project setup (install dependencies)
- [ ] Canvas component with Konva Stage
- [ ] Basic layer system (create, delete, reorder)
- [ ] Layer visibility toggle
- [ ] Layer opacity control

### Phase 2: Drawing Tools (Bottom Toolbar)

- [ ] Selection tool (V)
- [ ] Rectangle tool (R)
- [ ] Ellipse tool (O)
- [ ] Line tool (L)
- [ ] Pen/freehand tool (P)
- [ ] Text tool (T)
- [ ] Hand/pan tool (H)
- [ ] Zoom controls (+/-)

### Phase 3: Layer Panel (Right Sidebar)

- [ ] Layer list with thumbnails
- [ ] Drag-to-reorder layers
- [ ] Layer naming
- [ ] Lock layer
- [ ] Delete layer
- [ ] Duplicate layer
- [ ] Layer blend modes

### Phase 4: Object Properties

- [ ] Fill color
- [ ] Stroke color & width
- [ ] Opacity
- [ ] Position (X, Y)
- [ ] Size (W, H)
- [ ] Rotation
- [ ] Corner radius (rectangles)

### Phase 5: Persistence & Export

- [ ] Auto-save to IndexedDB
- [ ] Project management (new, open, delete)
- [ ] Export to PNG
- [ ] Export to SVG
- [ ] Import images

### Phase 6: Polish

- [ ] Keyboard shortcuts
- [ ] Undo/redo (Ctrl+Z, Ctrl+Shift+Z)
- [ ] Copy/paste objects
- [ ] Grid & snapping
- [ ] Dark theme (Figma-style)

---

## UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  DrawIt                                              [─] [□] [×] │
├──────────────────────────────────────────────────────────────────┤
│                                                    │ LAYERS      │
│                                                    │ ──────────  │
│                                                    │ [👁] Layer 3│
│                                                    │ [👁] Layer 2│
│                    CANVAS                          │ [👁] Layer 1│
│                                                    │             │
│                                                    │ ──────────  │
│                                                    │ PROPERTIES  │
│                                                    │ Fill: #000  │
│                                                    │ Stroke: #0  │
├────────────────────────────────────────────────────┴─────────────┤
│  [V] [□] [○] [/] [✎] [T] [✋]          │ Zoom: 100%  [−] [+]    │
└──────────────────────────────────────────────────────────────────┘
     ↑ Bottom Toolbar (Tools)
```

---

## Data Models

### Layer

```typescript
interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
  objects: CanvasObject[];
}
```

### CanvasObject

```typescript
interface CanvasObject {
  id: string;
  type: "rectangle" | "ellipse" | "line" | "path" | "text" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  // Type-specific properties
  points?: number[]; // For line/path
  text?: string; // For text
  fontSize?: number; // For text
  cornerRadius?: number; // For rectangle
  src?: string; // For image (base64)
}
```

### Project

```typescript
interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  canvasWidth: number;
  canvasHeight: number;
  layers: Layer[];
}
```

---

## NPM Packages to Install

```bash
npm install konva react-konva zustand dexie nanoid lucide-react immer
npm install -D @types/uuid
```

| Package        | Purpose                               |
| -------------- | ------------------------------------- |
| `konva`        | Canvas 2D library                     |
| `react-konva`  | React bindings for Konva              |
| `zustand`      | Lightweight state management          |
| `dexie`        | IndexedDB wrapper                     |
| `nanoid`       | Unique ID generation                  |
| `lucide-react` | Modern icon set                       |
| `immer`        | Immutable state updates (for history) |

---

## Keyboard Shortcuts

| Shortcut           | Action          |
| ------------------ | --------------- |
| `V`                | Selection tool  |
| `R`                | Rectangle tool  |
| `O`                | Ellipse tool    |
| `L`                | Line tool       |
| `P`                | Pen tool        |
| `T`                | Text tool       |
| `H`                | Hand/pan tool   |
| `Space + Drag`     | Temporary pan   |
| `Ctrl + Z`         | Undo            |
| `Ctrl + Shift + Z` | Redo            |
| `Ctrl + C`         | Copy            |
| `Ctrl + V`         | Paste           |
| `Delete`           | Delete selected |
| `Ctrl + D`         | Duplicate       |
| `Ctrl + S`         | Save project    |
| `+` / `-`          | Zoom in/out     |
| `Ctrl + 0`         | Zoom to fit     |
| `Ctrl + 1`         | Zoom to 100%    |

---

## Color Palette (Figma-inspired Dark Theme)

```css
:root {
  /* Background */
  --bg-canvas: #1e1e1e;
  --bg-panel: #2c2c2c;
  --bg-toolbar: #383838;
  --bg-hover: #444444;
  --bg-active: #0d99ff;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-tertiary: #757575;

  /* Borders */
  --border-default: #444444;
  --border-focus: #0d99ff;

  /* Accent */
  --accent-primary: #0d99ff;
  --accent-success: #14ae5c;
  --accent-warning: #ffcd29;
  --accent-error: #f24822;
}
```

---

## Implementation Order

1. **Setup** - Install packages, configure project structure
2. **Canvas Foundation** - Basic Konva stage with single layer
3. **Layer System** - Multi-layer support with visibility/opacity
4. **Bottom Toolbar** - Tool selection UI
5. **Selection Tool** - Select, move, resize objects
6. **Shape Tools** - Rectangle, ellipse, line
7. **Sidebar** - Layer panel with list
8. **Property Panel** - Edit selected object properties
9. **Freehand Drawing** - Pen tool for paths
10. **Persistence** - Save/load from IndexedDB
11. **Export** - PNG/SVG export
12. **Polish** - Keyboard shortcuts, undo/redo

---

## Verification Plan

### Manual Testing

1. **Layer Operations**: Create, delete, reorder, hide/show layers
2. **Drawing**: Use each tool to create objects on canvas
3. **Selection**: Click to select, drag to move, handles to resize
4. **Properties**: Change colors, opacity, dimensions
5. **Persistence**: Refresh page, verify data is restored
6. **Export**: Download PNG and verify image quality

### Browser Testing

- Test in Chrome, Firefox, Safari
- Test IndexedDB persistence across sessions
- Test keyboard shortcuts

---

## Notes

- Start with a minimal viable product focusing on core drawing functionality
- Prioritize performance - use React.memo, useMemo for expensive renders
- Consider virtualization for layer list if many layers
- Canvas operations should update Zustand store, which syncs to IndexedDB
