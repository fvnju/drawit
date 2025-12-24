import type { CanvasObject } from '../types/canvas';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getBoundingBox = (obj: CanvasObject): Rect => {
  // Simple bounding box for now, ignoring rotation for selection hit testing to be fast
  // or we can implement rotated bounding box later.
  // For line/pen updates this might need more logic
  if (obj.points && obj.points.length > 0) {
     // Calculate bounds from points
     let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
     for (let i = 0; i < obj.points.length; i += 2) {
         const x = obj.points[i];
         const y = obj.points[i+1];
         minX = Math.min(minX, x);
         minY = Math.min(minY, y);
         maxX = Math.max(maxX, x);
         maxY = Math.max(maxY, y);
     }
     // Points are usually relative to x,y in our implementation? 
     // In Canvas.tsx we did: `points: [...currentObj.points, relativeX, relativeY]`.
     // So points are relative to obj.x, obj.y.
     return {
         x: obj.x + minX,
         y: obj.y + minY,
         width: maxX - minX,
         height: maxY - minY
     };
  }

  // Basic shapes
  return {
    x: obj.x,
    y: obj.y,
    width: obj.width || 0,
    height: obj.height || 0
  };
};

export const doRectanglesIntersect = (r1: Rect, r2: Rect) => {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
};
