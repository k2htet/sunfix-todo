import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useTodoItemStateChange = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.task.getAllTasks.queryOptions("all").queryKey;

  return useMutation(
    trpc.task.updateTask.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });

        const previousTodo = queryClient.getQueryData(queryKey);
        const updateData = previousTodo?.map((prev) =>
          prev.id === data.id ? { ...prev, ...data } : prev
        );

        queryClient.setQueryData(queryKey, (prev) => {
          if (prev) {
            return updateData;
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

export default useTodoItemStateChange;
