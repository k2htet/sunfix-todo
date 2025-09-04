"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useCreateTodoMutation from "@/hooks/useCreateTodoMutation";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  text: z.string().min(2, { message: "Too Short" }).max(150),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.date(),
});

type TaskFormProps = {
  closeDrawer: () => void;
};

const TodoCreateForm = ({ closeDrawer }: TaskFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      priority: "Low",
      dueDate: new Date(),
    },
  });

  const mutation = useCreateTodoMutation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          closeDrawer();

          mutation.mutate({ ...values, text: values.text.trim() });
          if (mutation.isError) {
            form.setError("text", {
              type: "DBError",
              message: mutation.error.message,
            });
          }
        })}
        className="space-y-8 p-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add a new task." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-x-3">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = startOfDay(new Date());

                        return isBefore(date, today);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "ADDING" : "ADD"}
        </Button>
      </form>
    </Form>
  );
};

export default TodoCreateForm;
