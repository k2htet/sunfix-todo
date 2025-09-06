"use client";

import useReorderMutation from "@/hooks/useReorderMutation";
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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Task } from "../../type";
import TodoItem from "./todo-item";

type Props = {
  selectedTodos: Set<string>;
  setSelectedTodos: Dispatch<SetStateAction<Set<string>>>;
  data: Task;
};

const DndContainer = ({ data, selectedTodos, setSelectedTodos }: Props) => {
  const [activeTodo, setActiveTodo] = useState<Task[number]>();
  const [tempTodo, setTempTodo] = useState<Task>(data);
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  const mutation = useReorderMutation();

  const dataIds = useMemo<UniqueIdentifier[]>(() => {
    if (tempTodo) {
      return tempTodo?.map(({ order }) => order!) || [];
    }
    return data?.map(({ order }) => order!) || [];
  }, [data, tempTodo]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeItem = tempTodo.find((todo) => todo.order === active.id);
    setActiveTodo(activeItem);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);

      const reorderdData = arrayMove(data, oldIndex, newIndex);
      setTempTodo(reorderdData);
      await mutation.mutateAsync(
        reorderdData.map((item, index) => ({
          id: item.id,
          order: index + 1,
        }))
      );
    }
  }

  const toggleSelectTodo = (id: string) => {
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
        items={tempTodo}
        strategy={verticalListSortingStrategy}
        disabled={mutation.isPending}
      >
        {tempTodo &&
          tempTodo.map((todo) => (
            <TodoItem
              todo={todo}
              selectedTodos={selectedTodos}
              toggleSelectTodo={toggleSelectTodo}
              key={todo.order}
              disable={mutation.isPending}
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
            disable={mutation.isPending}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndContainer;
