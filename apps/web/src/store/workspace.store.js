import { create } from "zustand";

export const useWorkspaceStore = create((set) => ({
  workspaceId: null,

  setWorkspaceId: (id) => set({ workspaceId: id }),
}));