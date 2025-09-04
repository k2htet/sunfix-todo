"use client";

import { Task } from "@/db/schema";

import { useTodoStore } from "@/store/historyStore";

import { useEffect, useState } from "react";

import DndContainer from "./dnd-container";
import TodoBulkDelete from "./todo-bulk-delete";

const TodoItemContainer = ({ data }: { data: Task[] }) => {
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey; // Handles Ctrl+Z and Cmd+Z

      if (isCtrlOrCmd && event.key === "z") {
        event.preventDefault();
        useTodoStore.getState().undo();
      }

      if (isCtrlOrCmd && event.key === "y") {
        event.preventDefault();
        useTodoStore.getState().redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="py-3">
      {data.length !== 0 && (
        <TodoBulkDelete
          data={data}
          selectedTodos={selectedTodos}
          setSelectedTodos={setSelectedTodos}
        />
      )}

      {data.length === 0 ? (
        <div className="text-center text-xl py-8 text-muted-foreground">
          <h1>Welcome to Sunfix&apos;s todo.</h1>
        </div>
      ) : (
        <DndContainer
          data={data}
          selectedTodos={selectedTodos}
          setSelectedTodos={setSelectedTodos}
        />
      )}
    </div>
  );
};

export default TodoItemContainer;
