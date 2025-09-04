"use client";
import { Task } from "@/db/schema";
import { useTodoStore } from "@/store/historyStore";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction } from "react";
import { Loader2, Redo, Trash2, Undo } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  selectedTodos: Set<number>;
  setSelectedTodos: Dispatch<SetStateAction<Set<number>>>;
  data: Task[];
};
const TodoBulkDelete = ({ selectedTodos, setSelectedTodos, data }: Props) => {
  const canUndo = useTodoStore((state) => state.undoStack.length > 0);
  const canRedo = useTodoStore((state) => state.redoStack.length > 0);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { redo, undo } = useTodoStore();
  const queryKey = trpc.task.getAllTasks.queryOptions("all").queryKey;

  const bulkDeleteMutation = useMutation(
    trpc.task.bulkDelete.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });

        const previousTodo = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (prev) =>
          prev ? prev.filter((item) => !data.includes(item.id)) : prev
        );
        return { previousTodo };
      },
      onError: (error, _, ctx) => {
        queryClient.setQueryData(queryKey, ctx?.previousTodo);
      },
      onSettled: () => {
        setSelectedTodos(new Set());
        return queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
    })
  );

  const toggleSelectAll = () => {
    if (selectedTodos.size === data.length) {
      setSelectedTodos(new Set());
    } else {
      setSelectedTodos(new Set(data.map((todo) => todo.id)));
    }
  };
  return (
    <div className="flex items-center gap-2 my-4 p-2 bg-muted rounded-md">
      <div className="flex items-center flex-1 justify-between p-3 bg-muted/50 rounded-lg h-10">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedTodos.size === data.length && data.length > 0}
            onCheckedChange={toggleSelectAll}
            // disabled={isAnyMutationLoading}
          />
          <span className="text-sm text-muted-foreground">
            {selectedTodos.size === 0
              ? "Select all"
              : `${selectedTodos.size} selected`}
          </span>
        </div>
        <AlertDialog>
          {selectedTodos.size > 1 && (
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent className="w-[300px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure want to delete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  disabled={bulkDeleteMutation.isPending}
                  onClick={() =>
                    bulkDeleteMutation.mutate(Array.from(selectedTodos))
                  }
                  className="text-white"
                >
                  {bulkDeleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm">
        <Undo className="h-4 w-4 mr-2" /> Undo
      </Button>
      <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm">
        <Redo className="h-4 w-4 mr-2" /> Redo
      </Button>
    </div>
  );
};

export default TodoBulkDelete;
