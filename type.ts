import { trpc } from "@/trpc/server";
import { AppRouter } from "@/trpc/server/routers/_app";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { inferInput, inferOutput } from "@trpc/tanstack-react-query";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export type Task = inferOutput<typeof trpc.task.getAllTasks>;
export type CreateTask = inferInput<typeof trpc.task.createTask>;
export type UpdateTask = inferInput<typeof trpc.task.updateTask>;
