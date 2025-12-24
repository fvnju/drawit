# DrawIt

A Figma-inspired drawing application built with React, TypeScript, and Konva.

## Features

- **Drawing Tools**: Rectangle, Ellipse, Line, Pen (freehand), and Text
- **Layer System**: Create, reorder (drag & drop), show/hide, and lock layers
- **Object Properties**: Edit position, size, rotation, opacity, fill, and stroke
- **Selection**: Click to select, Shift+Click for multi-select, drag for marquee selection
- **Keyboard Shortcuts**: Delete/Backspace to remove, Escape to deselect
- **Auto-Save**: All work is saved automatically to IndexedDB

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd drawit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **Konva** + react-konva - Canvas rendering
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper for persistence
- **@dnd-kit** - Drag and drop for layer reordering
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── Canvas/       # Main drawing canvas
│   ├── Toolbar/      # Bottom toolbar with tools
│   └── Sidebar/      # Right sidebar (layers + properties)
├── stores/           # Zustand store
├── hooks/            # Custom React hooks
├── db/               # Dexie database setup
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## License

No license - All rights reserved.
