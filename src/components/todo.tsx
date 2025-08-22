"use client";

import { searchParamsParser } from "@/lib/searchParams";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useQueryStates } from "nuqs";
import TodoCreateForm from "./todo-create-form";
import TodoItemContainer from "./todo-item-container";
import { Button } from "./ui/button";
import withDrawer from "./withDrawer";

const DrawerTodoCreateForm = withDrawer(TodoCreateForm);

const triggerButton = (
  <div className="fixed inset-x-0 bottom-4 ">
    <div className="relative mx-auto max-w-md ">
      <Button
        className="absolute bottom-4 right-4 rounded-full shadow animate-bounce size-12"
        size="icon"
      >
        <Pencil />
      </Button>
    </div>
  </div>
);

const Todo = () => {
  const trpc = useTRPC();
  const [{ filter }] = useQueryStates(searchParamsParser);
  const { data } = useSuspenseQuery(trpc.task.getAllTasks.queryOptions(filter));

  console.log(data);

  return (
    <>
      <TodoItemContainer data={data} />
      <DrawerTodoCreateForm trigger={triggerButton} />
    </>
  );
};

export default Todo;
