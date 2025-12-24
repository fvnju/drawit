import { create } from 'zustand';
import type { CanvasObject, Layer, DrawingTool } from '../types/canvas';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

interface CanvasState {
  layers: Layer[];
  objects: Record<string, CanvasObject>;
  activeLayerId: string | null;
  selectedObjectIds: string[];
  tool: DrawingTool;
  
  // Actions
  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  
  addObject: (object: Omit<CanvasObject, 'id'>) => string;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  removeObject: (id: string) => void;
  
  setTool: (tool: DrawingTool) => void;
  selectObject: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setCanvasData: (data: { layers: Layer[], objects: Record<string, CanvasObject>, activeLayerId: string }) => void;
  reorderLayers: (oldIndex: number, newIndex: number) => void;
}

export const useCanvasStore = create<CanvasState>()(
  immer((set) => ({
    layers: [
      {
        id: 'layer-1',
        name: 'Layer 1',
        visible: true,
        locked: false,
        opacity: 1,
        children: []
      }
    ],
    objects: {},
    activeLayerId: 'layer-1',
    selectedObjectIds: [],
    tool: 'select',

    addLayer: () => set((state) => {
      const id = nanoid();
      state.layers.unshift({
        id,
        name: `Layer ${state.layers.length + 1}`,
        visible: true,
        locked: false,
        opacity: 1,
        children: []
      });
      state.activeLayerId = id;
    }),

    removeLayer: (id) => set((state) => {
      // Don't delete the last layer
      if (state.layers.length <= 1) return;
      
      const layerIndex = state.layers.findIndex(l => l.id === id);
      if (layerIndex === -1) return;

      // Remove objects in this layer
      const layer = state.layers[layerIndex];
      layer.children.forEach(objId => {
        delete state.objects[objId];
      });

      state.layers.splice(layerIndex, 1);
      
      // Update active layer if we deleted the current one
      if (state.activeLayerId === id) {
        state.activeLayerId = state.layers[0].id;
      }
    }),

    setActiveLayer: (id) => set((state) => {
      state.activeLayerId = id;
    }),

    toggleLayerVisibility: (id) => set((state) => {
      const layer = state.layers.find(l => l.id === id);
      if (layer) layer.visible = !layer.visible;
    }),

    toggleLayerLock: (id) => set((state) => {
      const layer = state.layers.find(l => l.id === id);
      if (layer) layer.locked = !layer.locked;
    }),

    addObject: (object) => {
      const id = nanoid();
      set((state) => {
        if (!state.activeLayerId) return;
        
        state.objects[id] = { ...object, id };
        
        const layer = state.layers.find(l => l.id === state.activeLayerId);
        if (layer) {
          layer.children.push(id);
        }
      });
      return id;
    },

    updateObject: (id, updates) => set((state) => {
      if (state.objects[id]) {
        state.objects[id] = { ...state.objects[id], ...updates };
      }
    }),

    removeObject: (id) => set((state) => {
      delete state.objects[id];
      state.layers.forEach(layer => {
        layer.children = layer.children.filter(childId => childId !== id);
      });
    }),

    setTool: (tool) => set((state) => {
      state.tool = tool;
      state.selectedObjectIds = []; // Deselect when changing tools
    }),

    selectObject: (id, multi = false) => set((state) => {
      if (multi) {
        if (state.selectedObjectIds.includes(id)) {
          state.selectedObjectIds = state.selectedObjectIds.filter(i => i !== id);
        } else {
          state.selectedObjectIds.push(id);
        }
      } else {
        state.selectedObjectIds = [id];
      }
    }),

    deselectAll: () => set((state) => {
      state.selectedObjectIds = [];
    }),

    setCanvasData: (data: { layers: Layer[], objects: Record<string, CanvasObject>, activeLayerId: string }) => set((state) => {
        state.layers = data.layers;
        state.objects = data.objects;
        state.activeLayerId = data.activeLayerId;
    }),

    reorderLayers: (oldIndex, newIndex) => set((state) => {
        // Simple array move logic
        if (oldIndex < 0 || oldIndex >= state.layers.length || newIndex < 0 || newIndex >= state.layers.length) return;
        const result = Array.from(state.layers);
        const [removed] = result.splice(oldIndex, 1);
        result.splice(newIndex, 0, removed);
        state.layers = result;
    })
  }))
);
