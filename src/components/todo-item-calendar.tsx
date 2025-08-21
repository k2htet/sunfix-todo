import { Task } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

const ToDoItemCalendar = ({ todo }: { todo: Task }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation(
    trpc.task.updateTask.mutationOptions({
      // onMutate is called before the mutation function is fired.
      onMutate: async (updatedTodo) => {
        const queryKey = trpc.task.getAllTasks.queryKey();
        await queryClient.cancelQueries({ queryKey });

        const previousTodos = queryClient.getQueryData<Task[]>(queryKey);

        queryClient.setQueryData<Task[]>(queryKey, (oldTodos = []) =>
          oldTodos.map((t) =>
            t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t
          )
        );

        setOpen(false);
        return { previousTodos };
      },

      onError: (err, variables, context) => {
        console.error(err);
        if (context?.previousTodos) {
          queryClient.setQueryData(
            trpc.task.getAllTasks.queryKey(),
            context.previousTodos
          );
        }
      },

      // Always refetch after success or failure to ensure the client is in sync with the server.
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
      },
    })
  );
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs bg-transparent"
            disabled={mutation.isPending}
          >
            <CalendarIcon className="size-4 mr-1" />
            {todo.dueDate ? format(todo.dueDate, "MMM dd") : "Set date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={todo.dueDate}
            onSelect={(date) => {
              if (date) {
                mutation.mutate({ id: todo.id, dueDate: date });
              }
            }}
            disabled={(date) => {
              const today = startOfDay(new Date());

              return isBefore(date, today);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ToDoItemCalendar;
