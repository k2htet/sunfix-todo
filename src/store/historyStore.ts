import { create } from "zustand";

import { Task } from "@/db/schema";
import {
  Command,
  createDeleteTaskCommand,
  createReorderTasksCommand,
} from "@/lib/command";

import { UseMutateFunction } from "@tanstack/react-query";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

interface TodoStoreState {
  undoStack: Command[];
  redoStack: Command[];
}

interface TodoStoreActions {
  deleteTask: (
    task: Task,
    deleteMutation: UseMutateFunction<
      {
        id: number;
      }[],
      TRPCClientErrorLike<{
        input: {
          id: number;
        };
        output: {
          id: number;
        }[];
        transformer: true;
        errorShape: DefaultErrorShape;
      }>,
      {
        id: number;
      },
      undefined
    >,
    createMutation: UseMutateFunction<
      Task,
      TRPCClientErrorLike<{
        input: {
          text: string;
          dueDate: Date;
          priority: "Low" | "Medium" | "High";
          completed?: boolean | undefined;
          order?: number | undefined;
        };
        output: Task;
        transformer: true;
        errorShape: DefaultErrorShape;
      }>,
      {
        text: string;
        dueDate: Date;
        priority: "Low" | "Medium" | "High";
        completed?: boolean | undefined;
        order?: number | undefined;
      },
      undefined
    >
  ) => void;
  reorderTasks: (
    oldOrder: Task[],
    newOrder: Task[],
    reorderMutation: UseMutateFunction<
      void,
      TRPCClientErrorLike<{
        input: {
          id: number;
          order: number;
        }[];
        output: void;
        transformer: true;
        errorShape: DefaultErrorShape;
      }>,
      {
        id: number;
        order: number;
      }[],
      {
        previousTodo:
          | {
              id: number;
              userId: string;
              text: string;
              completed: boolean;
              status: "Todo" | "In Progress" | "Done";
              priority: "Low" | "Medium" | "High";
              dueDate: Date;
              order: number | null;
              createdAt: Date;
              updatedAt: Date | null;
            }[]
          | undefined;
      }
    >
  ) => void;
  undo: () => void;
  redo: () => void;
}

type TodoStoreSet = (
  updater: (state: TodoStoreState) => Partial<TodoStoreState>
) => void;

// Internal function to execute commands, not exposed to components
const execute = (set: TodoStoreSet, command: Command) => {
  command.execute();
  set((state: TodoStoreState) => ({
    undoStack: [...state.undoStack, command],
    redoStack: [],
  }));
};

export const useTodoStore = create<TodoStoreState & TodoStoreActions>(
  (set, get) => ({
    undoStack: [],
    redoStack: [],

    deleteTask: (task, deleteMutation, createMutation) => {
      const command = createDeleteTaskCommand(
        task,
        deleteMutation,
        createMutation
      );
      execute(set, command);
    },

    reorderTasks: (oldOrder, newOrder, reorderMutation) => {
      const command = createReorderTasksCommand(
        oldOrder,
        newOrder,
        reorderMutation
      );
      execute(set, command);
    },

    undo: () => {
      const { undoStack } = get();
      const command = undoStack[undoStack.length - 1];
      if (command) {
        command.undo();
        set((state) => ({
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, command],
        }));
      }
    },

    redo: () => {
      const { redoStack } = get();
      const command = redoStack[redoStack.length - 1];
      if (command) {
        command.execute();
        set((state) => ({
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, command],
        }));
      }
    },
  })
);
