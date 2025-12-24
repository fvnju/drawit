export type DrawingTool = 'select' | 'rectangle' | 'ellipse' | 'line' | 'pen' | 'text' | 'hand';

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CanvasObject {
  id: string;
  type: DrawingTool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  points?: number[]; // For lines and pen paths
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  isDragging?: boolean;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  children: string[]; // IDs of CanvasObjects
}
