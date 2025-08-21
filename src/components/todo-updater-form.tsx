"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";

const formSchema = z.object({
  text: z.string().min(2, { message: "Too Short" }).max(150),
});

type TaskUpdateFormProps = {
  closeDrawer: () => void;
  task: {
    id: number;
    text: string;
  };
};

const TaskUpdateForm = ({ closeDrawer, task }: TaskUpdateFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: task.text },
  });

  const mutation = useMutation(
    trpc.task.updateTask.mutationOptions({
      onError: (error) =>
        form.setError("text", { type: "DBError", message: error.message }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.task.getAllTasks.queryKey(),
        });
        closeDrawer();
      },
    })
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newText = values.text.trim();
    if (newText === task.text) return; // nothing changed

    mutation.mutate({ id: task.id, text: newText });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Update task..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          Update
        </Button>
      </form>
    </Form>
  );
};

export default TaskUpdateForm;
