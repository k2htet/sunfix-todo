import useTodoItemStateChange from "@/hooks/useTodoItemStateChange";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Task } from "../../type";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ToDoItemCalendar = ({ todo }: { todo: Task[number] }) => {
  const [open, setOpen] = useState(false);

  const mutation = useTodoItemStateChange();
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs bg-transparent disabled:opacity-90"
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
                mutation.mutate({ ...todo, dueDate: date });
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
