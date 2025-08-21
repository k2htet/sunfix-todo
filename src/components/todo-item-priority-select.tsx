"use client";
import { Task } from "@/db/schema";
import { cn, getPriorityColor } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TodoItemPrioritySelect = ({ todo }: { todo: Task }) => {
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
      value={todo.priority}
      onValueChange={async (value: Task["priority"]) =>
        mutation.mutate({ id: todo.id, priority: value })
      }
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className={cn("w-full h-7 text-xs", getPriorityColor(todo.priority))}
      >
        <div className="flex items-center gap-1">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Low">Low</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="High">High</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TodoItemPrioritySelect;
