"use client";
import { Task } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";

const TodoItemStatusSelect = ({ todo }: { todo: Task }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    trpc.task.updateTask.mutationOptions({
      onError: (error) => console.error(error),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
    })
  );

  return (
    <Select
      value={todo.status}
      onValueChange={async (value: Task["status"]) =>
        mutation.mutate({ id: todo.id, status: value })
      }
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className={cn(
          "w-full h-7 text-xs",
          todo.status === "Todo"
            ? "text-destructive"
            : todo.status === "In Progress"
            ? "text-blue-600"
            : "text-green-600"
        )}
      >
        <div className="flex items-center gap-1">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Todo">Todo</SelectItem>
        <SelectItem value="In Progress">Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TodoItemStatusSelect;
