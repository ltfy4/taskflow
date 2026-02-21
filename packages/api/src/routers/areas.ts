import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createAreaSchema, updateAreaSchema } from "@taskflow/core";

export const areasRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    // TODO: implement
    return [] as never[];
  }),

  create: protectedProcedure
    .input(createAreaSchema)
    .mutation(({ ctx, input }) => {
      // TODO: implement
      return null as never;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), data: updateAreaSchema }))
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
