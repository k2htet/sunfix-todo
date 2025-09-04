import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteTodoMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.task.getAllTasks.queryOptions("all").queryKey;

  return useMutation(
    trpc.task.deleteTask.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });

        const previousTodo = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (prev) =>
          prev ? prev.filter((item) => item.id !== data.id) : prev
        );
        return { previousTodo };
      },
      onError: (error, _, ctx) => {
        queryClient.setQueryData(queryKey, ctx?.previousTodo);
      },
      onSettled: () => {
        return queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
    })
  );
};

export default useDeleteTodoMutation;
