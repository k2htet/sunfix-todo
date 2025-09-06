import { useTodoStore } from "@/hooks/useTodoStore";
import useCreateTodoMutation from "@/hooks/useCreateTodoMutation";

import { CreateTask } from "../../type";
import useDeleteTodoMutation from "./useDeleteTodoMutation";

export const useDeleteTodoCommand = () => {
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  return (task: CreateTask) => {
    const taskData = { ...task };

    return {
      undo: async () => {
        // Undo the mutation (optimistic update is already handled)
        const newTask = await createTodoMutation.mutateAsync(task);

        // Update Zustand store (optional if you rely only on cache)
        useTodoStore.setState((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      execute: async () => {
        // Execute by deleting the created task
        await deleteTodoMutation.mutateAsync({ id: taskData.id });

        useTodoStore.setState((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskData.id),
        }));
      },
    };
  };
};
