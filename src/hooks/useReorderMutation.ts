import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useReorderMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.task.getAllTasks.queryOptions("all").queryKey;

  return useMutation(
    trpc.task.reorderTasks.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey,
        });

        const previousTodo = queryClient.getQueryData(queryKey);

        const reordered = previousTodo?.map((todo) => {
          const updated = data.find((d) => d.id === todo.id);
          return {
            ...todo,
            order: updated ? updated.order : todo.order,
          };
        });

        queryClient.setQueryData(queryKey, (prev) => (prev ? reordered : prev));

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

export default useReorderMutation;
