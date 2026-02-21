import { z } from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(50).nullish(),
  color: z.string().max(20).nullish(),
  sortOrder: z.number().int().optional(),
});

export const updateAreaSchema = createAreaSchema.partial();
