"use client";

import { cn } from "@/lib/utils";
import { Task } from "../../type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useTodoItemStateChange from "@/hooks/useTodoItemStateChange";

const TodoItemStatusSelect = ({ todo }: { todo: Task[number] }) => {
  const mutation = useTodoItemStateChange();

  return (
    <Select
      value={todo.status}
      onValueChange={async (value: Task[number]["status"]) =>
        mutation.mutate({ ...todo, status: value })
      }
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className={cn(
          "w-full h-7 text-xs disabled:opacity-90",
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
