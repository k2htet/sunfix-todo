import { create } from "zustand";
import type { AppRouter } from "@/trpc/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type Task = inferRouterOutputs<AppRouter>["task"]["getAllTasks"][number];

export type Action =
  | { type: "CREATE"; task: Task }
  | { type: "DELETE"; task: Task };

interface HistoryState {
  undoStack: Action[];
  redoStack: Action[];
  logAction: (action: Action) => void;
  undo: () => Action | null;
  redo: () => Action | null;
  updateTopUndo: (task: Task) => void;
  updateTopRedo: (task: Task) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],

  logAction: (action) =>
    set((state) => ({
      undoStack: [...state.undoStack, action],
      redoStack: [], // clear redo stack on new action
    })),

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const action = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, action],
    });
    return action;
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;
    const action = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, action],
    });
    return action;
  },

  updateTopUndo: (task) =>
    set((state) => {
      if (state.undoStack.length === 0) return {};
      const updated = [...state.undoStack];
      const top = updated[updated.length - 1];
      if (top.type === "CREATE" || top.type === "DELETE") {
        updated[updated.length - 1] = { ...top, task };
      }
      return { undoStack: updated };
    }),

  updateTopRedo: (task) =>
    set((state) => {
      if (state.redoStack.length === 0) return {};
      const updated = [...state.redoStack];
      const top = updated[updated.length - 1];
      if (top.type === "CREATE" || top.type === "DELETE") {
        updated[updated.length - 1] = { ...top, task };
      }
      return { redoStack: updated };
    }),

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
