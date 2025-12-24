import Dexie, { type Table } from 'dexie';
import type { Layer, CanvasObject } from '../types/canvas';

export interface ProjectData {
  id: string; // 'current-project' for this app's simple version
  layers: Layer[];
  objects: Record<string, CanvasObject>;
  activeLayerId: string;
  updatedAt: number;
}

class DrawItDatabase extends Dexie {
  projects!: Table<ProjectData>;

  constructor() {
    super('DrawItDB');
    this.version(1).stores({
      projects: 'id'
    });
  }
}

export const db = new DrawItDatabase();

export const saveProject = async (data: Omit<ProjectData, 'id' | 'updatedAt'>) => {
  await db.projects.put({
    id: 'current-project',
    updatedAt: Date.now(),
    ...data
  });
};

export const loadProject = async () => {
    return await db.projects.get('current-project');
};
