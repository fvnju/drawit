import { useEffect } from 'react';
import { useCanvasStore } from '../stores/canvasStore';

export const useKeyboard = () => {
  const { selectedObjectIds, removeObject, deselectAll } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedObjectIds.length > 0) {
            e.preventDefault();
            selectedObjectIds.forEach(id => removeObject(id));
            deselectAll(); // Clear selection after deletion
          }
          break;
        case 'Escape':
            deselectAll();
            break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectIds, removeObject, deselectAll]);
};
