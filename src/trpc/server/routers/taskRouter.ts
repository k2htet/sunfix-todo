import { statusSchema, tasks } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

import { and, asc, desc, eq, inArray, max, sql } from "drizzle-orm";
import z from "zod/v4";

const taskInsertSchema = z.object({
  text: z.string().min(1, { message: "Task cannot be empty" }),
  dueDate: z.date(),
  priority: z.enum(["Low", "Medium", "High"]),
  completed: z.boolean().optional(),
  order: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const taskUpdateSchema = z.object({
  id: z.number(),
  text: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  dueDate: z.date().optional(),
  status: z.enum(["Todo", "In Progress", "Done"]).optional(),
});

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(taskInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [maxOrderResult] = await ctx.db
        .select({ maxValue: max(tasks.order) })
        .from(tasks)
        .where(eq(tasks.userId, ctx.user.id));

      const newOrder = (maxOrderResult?.maxValue ?? 0) + 1;

      const [newTask] = await ctx.db
        .insert(tasks)
        .values({
          text: input.text,
          userId: ctx.user.id,
          order: newOrder,
          dueDate: input.dueDate,
          priority: input.priority,
        })
        .returning();

      return newTask;
    }),

  getAllTasks: protectedProcedure
    .input(statusSchema)
    .query(async ({ ctx, input }) => {
      const filter =
        input === "inComplete" ? false : input === "complete" && true;

      if (input === "all") {
        return await ctx.db
          .select()
          .from(tasks)
          .orderBy(asc(tasks.order))
          .where(eq(tasks.userId, ctx.user.id));
      }

      return await ctx.db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, ctx.user.id), eq(tasks.completed, filter)))
        .orderBy(desc(tasks.order));
    }),
  updateTask: protectedProcedure
    .input(taskUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return await ctx.db
        .update(tasks)
        .set({
          ...updateData,
          completed: updateData.status === "Done" ? true : false,
        })
        .where(and(eq(tasks.id, id), eq(tasks.userId, ctx.user.id)))
        .returning();
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(tasks)
        .where(
          // Ensure the user owns the task they are trying to delete
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.user.id))
        )
        .returning({ id: tasks.id }); // Return the ID of the deleted task
    }),
  bulkDelete: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(tasks)
        .where(and(inArray(tasks.id, input), eq(tasks.userId, ctx.user.id)));
    }),

  reorderTasks: protectedProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ ctx, input }) => {
      if (!input.length) return;
      const taskIds = input.map((t) => t.id);
      let caseStatement = sql`(CASE`;
      input.forEach((task) => {
        caseStatement = sql`${caseStatement} WHEN ${tasks.id} = ${task.id} THEN ${task.order}`;
      });
      caseStatement = sql`${caseStatement} END)::integer`;

      await ctx.db
        .update(tasks)
        .set({
          order: caseStatement,
          updatedAt: new Date(),
        })
        .where(and(inArray(tasks.id, taskIds), eq(tasks.userId, ctx.user.id)));
    }),
});
