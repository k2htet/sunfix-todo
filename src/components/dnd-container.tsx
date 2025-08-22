"use client";

import { Task } from "@/db/schema";
import { useTodoStore } from "@/store/historyStore";
import { useTRPC } from "@/trpc/client";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import TodoItem from "./todo-item";

type Props = {
  selectedTodos: Set<number>;
  setSelectedTodos: Dispatch<SetStateAction<Set<number>>>;
  data: Task[];
};

const DndContainer = ({ data, selectedTodos, setSelectedTodos }: Props) => {
  const [activeTodo, setActiveTodo] = useState<Task>();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const reorderTasks = useTodoStore((state) => state.reorderTasks);

  const mutation = useMutation(
    trpc.task.reorderTasks.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
      onError: (error) => console.log(error),
    })
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ order }) => order!) || [],
    [data]
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeItem = data.find((todo) => todo.order === active.id);
    setActiveTodo(activeItem);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);

      const reorderdData = arrayMove(data, oldIndex, newIndex);
      console.log(reorderdData);
      reorderTasks(data, reorderdData, mutation.mutate);
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
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext
        items={dataIds}
        strategy={verticalListSortingStrategy}
        disabled={mutation.isPending}
      >
        {data
          .slice()
          .reverse()
          .map((todo) => (
            <TodoItem
              todo={todo}
              selectedTodos={selectedTodos}
              toggleSelectTodo={toggleSelectTodo}
              key={todo.order}
            />
          ))}
      </SortableContext>
      <DragOverlay>
        {activeTodo ? (
          <TodoItem
            todo={activeTodo}
            selectedTodos={selectedTodos}
            toggleSelectTodo={toggleSelectTodo}
            key={activeTodo.order}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndContainer;
