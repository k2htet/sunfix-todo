"use client";

import { useState } from "react";

import DndContainer from "./dnd-container";
import TodoBulkDelete from "./todo-bulk-delete";
import { Task } from "../../type";

const TodoItemContainer = ({ data }: { data: Task }) => {
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());

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
