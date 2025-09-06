"use client";

import { Checkbox } from "./ui/checkbox";

import { formatRelativeTime, isOverdue } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, GripVertical } from "lucide-react";
import ToDoItemCalendar from "./todo-item-calendar";
import TodoItemMenu from "./todo-item-menu";
import TodoItemPrioritySelect from "./todo-item-priority-select";
import TodoItemStatusSelect from "./todo-item-status-select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Task } from "../../type";
function DragHandle({ id, disable }: { id: number; disable: boolean }) {
  const { attributes, listeners } = useSortable({
    id,
  });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab disabled:cursor-not-allowed"
      disabled={disable}
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const TodoItem = ({
  todo,
  selectedTodos,
  toggleSelectTodo,
  disable,
}: {
  todo: Task[number];
  selectedTodos: Set<string>;
  toggleSelectTodo: (id: string) => void;
  disable: boolean;
}) => {
  const { transform, transition, setNodeRef } = useSortable({
    id: todo.order!,
  });

  return (
    <div
      className={`flex flex-col items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors relative my-3 ${
        selectedTodos.has(todo.id) ? "ring-2 ring-primary/20 bg-accent/30" : ""
      }  ${
        isOverdue(todo.dueDate) && !todo.completed
          ? "border-destructive/50"
          : ""
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      ref={setNodeRef}
    >
      <div className="flex justify-between items-center gap-2 pt-1 w-full">
        <div className="flex justify-center items-center gap-x-3">
          <DragHandle id={todo.order!} disable={disable} />
          <Checkbox
            checked={selectedTodos.has(todo.id)}
            onCheckedChange={() => toggleSelectTodo(todo.id)}
          />
        </div>
        {todo.dueDate && isOverdue(todo.dueDate) && !todo.completed && (
          <Badge
            variant="destructive"
            className="text-xs flex items-center gap-1 "
          >
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
        )}
        <TodoItemMenu todo={todo} selectedTodos={selectedTodos} />
      </div>

      <div className="flex-1 space-y-2 w-full">
        <div
          className={`font-medium  ${
            todo.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {todo.text}
        </div>

        <div className="grid grid-cols-3 w-full gap-1">
          <TodoItemStatusSelect todo={todo} />
          <TodoItemPrioritySelect todo={todo} />
          <ToDoItemCalendar todo={todo} />
        </div>

        <div className="flex justify-between items-center">
          {todo.createdAt && (
            <div className="text-xs text-muted-foreground">
              Created {formatRelativeTime(todo.createdAt)}
            </div>
          )}
          {todo.updatedAt && (
            <div className="text-xs text-muted-foreground">
              Updated {formatRelativeTime(todo.createdAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
