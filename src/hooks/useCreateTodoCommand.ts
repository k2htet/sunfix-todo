import { useTodoStore } from "@/hooks/useTodoStore";
import useCreateTodoMutation from "@/hooks/useCreateTodoMutation";

import { CreateTask } from "../../type";
import useDeleteTodoMutation from "./useDeleteTodoMutation";

export const useCreateTodoCommand = () => {
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  return (task: CreateTask) => {
    let createdTaskId: string | null = null;

    return {
      execute: async () => {
        // Execute the mutation (optimistic update is already handled)
        const newTask = await createTodoMutation.mutateAsync(task);
        createdTaskId = newTask.id;

        // Update Zustand store (optional if you rely only on cache)
        useTodoStore.setState((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      undo: async () => {
        if (!createdTaskId) return;

        // Undo by deleting the created task
        await deleteTodoMutation.mutateAsync({ id: createdTaskId });

        useTodoStore.setState((state) => ({
          tasks: state.tasks.filter((t) => t.id !== createdTaskId),
        }));
      },
    };
  };
};
