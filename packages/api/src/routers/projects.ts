import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createProjectSchema, updateProjectSchema } from "@taskflow/core";

export const projectsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    // TODO: implement
    return [] as never[];
  }),

  getByArea: protectedProcedure
    .input(z.object({ areaId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      // TODO: implement
      return [] as never[];
    }),

  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), data: updateProjectSchema }))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  complete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  reorder: protectedProcedure
    .input(z.array(z.object({ id: z.string().uuid(), sortOrder: z.number() })))
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),
});
