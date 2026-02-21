import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().max(20).nullish(),
});

export const updateTagSchema = createTagSchema.partial();
