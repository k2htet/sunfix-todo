export interface Command {
  execute: () => void;
  undo: () => void;
}

import { Task } from "@/db/schema";

import { UseMutateFunction } from "@tanstack/react-query";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

export function createDeleteTaskCommand(
  taskToDelete: Task,
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
        createdAt?: Date;
        updateAt?: Date;
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
      createdAt?: Date;
      updateAt?: Date;
    },
    undefined
  >
): Command {
  return {
    execute() {
      deleteMutation({ id: taskToDelete.id });
    },
    undo() {
      createMutation({
        text: taskToDelete.text,
        dueDate: taskToDelete.dueDate,
        priority: taskToDelete.priority,
        order: taskToDelete.order!,
        completed: taskToDelete.completed,
        createdAt: taskToDelete.createdAt,
        updateAt: new Date(),
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
      console.log(
        newOrder.map((task, index) => ({ id: task.id, order: index + 1 }))
      );
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
