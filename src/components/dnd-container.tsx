"use client";

import useDragReorder from "@/hooks/useDragReorder";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useState } from "react";
import { Task } from "../../type";
import TodoItem from "./todo-item";

type Props = {
  selectedTodos: Set<string>;
  setSelectedTodos: Dispatch<SetStateAction<Set<string>>>;
  data: Task;
};

const DndContainer = ({ data, selectedTodos, setSelectedTodos }: Props) => {
  const [activeTodo, setActiveTodo] = useState<Task[number]>();
  const { reorder, dragItem, disable } = useDragReorder(data);
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeItem = dragItem.find((todo) => todo.order === active.id);
    setActiveTodo(activeItem);
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
      onDragEnd={reorder}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext
        items={dragItem}
        strategy={verticalListSortingStrategy}
        disabled={disable}
      >
        {dragItem &&
          dragItem
            .slice()
            .reverse()
            .map((todo) => (
              <TodoItem
                todo={todo}
                selectedTodos={selectedTodos}
                toggleSelectTodo={toggleSelectTodo}
                key={todo.id}
                disable={disable}
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
            disable={disable}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndContainer;
