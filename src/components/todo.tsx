"use client";

import { searchParamsParser } from "@/lib/searchParams";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useQueryStates } from "nuqs";
import TaskForm from "./task-form";
import TodoItemContainer from "./todo-item-container";
import { Button } from "./ui/button";
import withDrawer from "./withDrawer";

const DrawerTaskForm = withDrawer(TaskForm);

const triggerButton = (
  <Button
    className="absolute bottom-4 right-4 rounded-full shadow animate-bounce"
    size="icon"
  >
    <Pencil />
  </Button>
);

const Todo = () => {
  const trpc = useTRPC();
  const [{ filter }] = useQueryStates(searchParamsParser);
  const { data } = useSuspenseQuery(trpc.task.getAllTasks.queryOptions(filter));

  return (
    <>
      <TodoItemContainer data={data} />
      <DrawerTaskForm trigger={triggerButton} />
    </>
  );
};

export default Todo;
