"use client";

import { Button } from "./ui/button";
import { Undo, Redo } from "lucide-react";
import { useHistoryStore } from "@/store/historyStore";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UndoRedoKeyboard } from "./undoRedoKeyboard";

export const UndoRedoControls = () => {
  const { undo, redo, canUndo, canRedo, updateTopUndo, updateTopRedo } =
    useHistoryStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.task.getAllTasks.queryKey(),
    });

  const createTaskMutation = useMutation(
    trpc.task.createTask.mutationOptions({
      onSuccess: () => invalidate(),
    })
  );

  const deleteTaskMutation = useMutation(
    trpc.task.deleteTask.mutationOptions({ onSuccess: invalidate })
  );

  const handleUndo = () => {
    const action = undo();
    if (!action) return;

    switch (action.type) {
      case "CREATE":
        deleteTaskMutation.mutate({ id: action.task.id });
        break;
      case "DELETE":
        createTaskMutation.mutate(
          {
            text: action.task.text,
            priority: action.task.priority,
            dueDate: action.task.dueDate,
          },
          {
            onSuccess: (newTask) => {
              // fix redo stack with correct ID
              updateTopRedo(newTask);
            },
          }
        );
        break;
    }
  };

  const handleRedo = () => {
    const action = redo();
    if (!action) return;

    switch (action.type) {
      case "CREATE":
        createTaskMutation.mutate(
          {
            text: action.task.text,
            priority: action.task.priority,
            dueDate: action.task.dueDate,
          },
          {
            onSuccess: (newTask) => {
              // fix undo stack with correct ID
              updateTopUndo(newTask);
            },
          }
        );
        break;
      case "DELETE":
        deleteTaskMutation.mutate({ id: action.task.id });
        break;
    }
  };

  return (
    <div className="flex items-center gap-2 ">
      <Button
        variant="outline"
        size="icon"
        onClick={handleUndo}
        disabled={
          !canUndo() ||
          deleteTaskMutation.isPending ||
          createTaskMutation.isPending
        }
      >
        <Undo className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleRedo}
        disabled={
          !canRedo() ||
          deleteTaskMutation.isPending ||
          createTaskMutation.isPending
        }
      >
        <Redo className="size-4" />
      </Button>
      <UndoRedoKeyboard handleRedo={handleRedo} handleUndo={handleUndo} />
    </div>
  );
};
