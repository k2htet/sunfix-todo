export interface Command {
  execute: () => void;
  undo: () => void;
}

import { Task } from "@/db/schema";

import { UseMutateFunction, UseMutationResult } from "@tanstack/react-query";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

export function createDeleteTaskCommand(
  taskToDelete: Task,
  deleteMutation: UseMutationResult,
  createMutation: UseMutationResult
): Command {
  return {
    execute() {
      deleteMutation.mutate({ id: taskToDelete.id });
    },
    undo() {
      createMutation.mutate({
        text: taskToDelete.text,
        completed: taskToDelete.completed,
        order: taskToDelete.order,
      });
    },
  };
}

export function createReorderTasksCommand(
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
    undefined
  >
): Command {
  return {
    execute() {
      reorderMutation(
        newOrder.map((task, index) => ({ id: task.id, order: index + 1 }))
      );
    },
    undo() {
      reorderMutation(
        oldOrder.map((task, index) => ({ id: task.id, order: index + 1 }))
      );
    },
  };
}
