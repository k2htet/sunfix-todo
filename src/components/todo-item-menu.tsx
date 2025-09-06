"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useDeleteTodoCommand } from "@/hooks/useDeleteTodoCommand";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Task } from "../../type";
import TaskUpdateForm from "./todo-updater-form";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTodoStore } from "@/hooks/useTodoStore";

const TodoItemMenu = ({
  todo,
  selectedTodos,
}: {
  todo: Task[number];
  selectedTodos: Set<string>;
}) => {
  const [open, setOpen] = useState(false);
  const execute = useTodoStore((state) => state.executeCommand);
  const deleteMutation = useDeleteTodoCommand();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-4 mt-1">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="min-w-[6rem] mr-2">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DrawerTrigger asChild>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DrawerTrigger>

          {selectedTodos.size <= 1 && (
            <DropdownMenuItem
              onClick={async () => {
                await execute(
                  deleteMutation({
                    ...todo,
                    order: todo.order as number,
                    updatedAt: new Date(),
                  })
                );

                selectedTodos.delete(todo.id);
              }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Update Todo</DrawerTitle>
        </DrawerHeader>
        <TaskUpdateForm task={todo} closeDrawer={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default TodoItemMenu;
