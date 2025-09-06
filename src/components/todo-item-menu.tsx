"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Loader2Icon } from "lucide-react";
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

const TodoItemMenu = ({
  todo,
  selectedTodos,
}: {
  todo: Task[number];
  selectedTodos: Set<string>;
}) => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.task.deleteTask.mutationOptions({
      onError: (error) => console.log(error),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
        selectedTodos.delete(todo.id);
      },
    })
  );

  const createMutation = useMutation(
    trpc.task.createTask.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
    })
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-4 mt-1"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              <EllipsisVertical className="h-4 w-4" />
            )}
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
              // onClick={() => handleDelete(todo)}
              disabled={deleteMutation.isPending}
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
