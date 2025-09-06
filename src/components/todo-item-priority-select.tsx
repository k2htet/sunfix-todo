"use client";

import { cn, getPriorityColor } from "@/lib/utils";
import { Task } from "../../type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import useTodoItemStateChange from "@/hooks/useTodoItemStateChange";

const TodoItemPrioritySelect = ({ todo }: { todo: Task[number] }) => {
  const mutation = useTodoItemStateChange();

  return (
    <Select
      value={todo.priority}
      onValueChange={async (value: Task[number]["priority"]) =>
        mutation.mutate({ ...todo, priority: value })
      }
      disabled={mutation.isPending}
    >
      <SelectTrigger
        className={cn(
          "w-full h-7 text-xs disabled:opacity-90",
          getPriorityColor(todo.priority)
        )}
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
