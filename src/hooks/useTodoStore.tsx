import { create } from "zustand";
import { Task } from "../../type";

interface Command {
  execute: () => Promise<void>;
  undo: () => Promise<void>;
}

interface TodoStore {
  tasks: Task;
  history: Command[];
  undone: Command[];
  executeCommand: (cmd: Command) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  history: [],
  undone: [],

  executeCommand: async (cmd) => {
    await cmd.execute();
    set((state) => ({
      history: [...state.history, cmd],
      undone: [],
    }));
  },

  undo: async () => {
    const history = get().history;
    if (!history.length) return;
    const cmd = history[history.length - 1];
    await cmd.undo();
    set((state) => ({
      history: state.history.slice(0, -1),
      undone: [...state.undone, cmd],
    }));
  },

  redo: async () => {
    const undone = get().undone;
    if (!undone.length) return;
    const cmd = undone[undone.length - 1];
    await cmd.execute();
    set(() => ({
      history: [...get().history, cmd],
      undone: undone.slice(0, -1),
    }));
  },
  canUndo: () => get().history.length > 0,
  canRedo: () => get().undone.length > 0,
}));
