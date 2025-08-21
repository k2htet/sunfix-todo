import { createTRPCRouter } from "../init";
import { taskRouter } from "./taskRouter";

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
