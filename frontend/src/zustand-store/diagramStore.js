import { create } from 'zustand';

export const useDiagramStore = create((set) => ({
  diagramId: null,
  title: 'Untitled project',
  code: 'paste ur table code here',
  
  setDiagramId: (id) => set({ diagramId: id }),
  setTitle: (title) => set({ title }),
  setCode: (code) => set({ code }),
}));
