"use client";

import { Task } from "@/db/schema";

import { useTodoStore } from "@/store/historyStore";
import { useTRPC } from "@/trpc/client";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Redo, Trash2, Undo } from "lucide-react";
import { useId, useMemo, useState } from "react";
import TodoItem from "./todo-item";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

const TodoItemContainer = ({ data }: { data: Task[] }) => {
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  // const [data, setData] = useState<Task[]>(todos);

  const { reorderTasks, undo, redo } = useTodoStore();
  const canUndo = useTodoStore((state) => state.undoStack.length > 0);
  const canRedo = useTodoStore((state) => state.redoStack.length > 0);

  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    trpc.task.reorderTasks.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
      onError: (error) => console.log(error),
    })
  );

  const bulkDeleteMutation = useMutation(
    trpc.task.bulkDelete.mutationOptions({
      onError: (error) => console.log(error),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
        setSelectedTodos(new Set());
      },
    })
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ order }) => order!).sort((a, b) => a - b) || [],
    [data]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      console.log(newIndex, oldIndex);
      const reorderdData = arrayMove(data, oldIndex, newIndex);

      reorderTasks(data, reorderdData, mutation.mutate);
      // mutation.mutate(
      //   reorderdData.map((task, index) => ({
      //     id: task.id,
      //     order: index + 1,
      //   }))
      // );
    }
  }
  const toggleSelectTodo = (id: number) => {
    const newSelected = new Set(selectedTodos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTodos(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedTodos.size === data.length) {
      setSelectedTodos(new Set());
    } else {
      setSelectedTodos(new Set(data.map((todo) => todo.id)));
    }
  };

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     const isCtrlOrCmd = event.ctrlKey || event.metaKey; // Handles Ctrl+Z and Cmd+Z

  //     if (isCtrlOrCmd && event.key === "z") {
  //       event.preventDefault();
  //       useTodoStore.getState().undo();
  //     }

  //     if (isCtrlOrCmd && event.key === "y") {
  //       event.preventDefault();
  //       useTodoStore.getState().redo();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   // Cleanup function to remove the event listener
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  return (
    <div className="py-3">
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
          {selectedTodos.size > 1 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                bulkDeleteMutation.mutate(Array.from(selectedTodos))
              }
              className="flex items-center gap-2"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm">
          <Undo className="h-4 w-4 mr-2" /> Undo
        </Button>
        <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm">
          <Redo className="h-4 w-4 mr-2" /> Redo
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No todos yet. Add one above!
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <SortableContext
            items={dataIds}
            strategy={verticalListSortingStrategy}
            disabled={mutation.isPending}
          >
            {data.map((todo) => (
              <TodoItem
                todo={todo}
                selectedTodos={selectedTodos}
                toggleSelectTodo={toggleSelectTodo}
                key={todo.order}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default TodoItemContainer;
