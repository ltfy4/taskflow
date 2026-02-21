import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema } from "@taskflow/core";

export const tasksRouter = router({
  /** Get all active tasks for the current user */
  getAll: protectedProcedure.query(({ ctx }) => {
    // TODO: implement with PowerSync / Drizzle
    return [] as never[];
  }),

  /** Get a single task by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  /** Create a new task */
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  /** Update an existing task */
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), data: updateTaskSchema }))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  /** Soft-delete a task */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),
});
