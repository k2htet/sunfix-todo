import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateTodoMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.task.getAllTasks.queryOptions("all").queryKey;
  const { data: session } = authClient.useSession();

  return useMutation(
    trpc.task.createTask.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });

        const previousTodo = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (prev) => {
          if (prev) {
            return [
              ...prev,
              {
                text: data.text,
                dueDate: data.dueDate,
                priority: data.priority,
                order: prev.length + 1,
                completed: data.completed ? data.completed : false,
                userId: session!.user.id,
                status: "Todo" as const,
                createdAt: new Date(),
                id: Math.random(),
                updatedAt: null,
              },
            ];
          }
          return prev;
        });

        return { previousTodo };
      },

      onError: (error, newTodo, ctx) => {
        queryClient.setQueryData(queryKey, ctx?.previousTodo);
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        }),
    })
  );
};

export default useCreateTodoMutation;
