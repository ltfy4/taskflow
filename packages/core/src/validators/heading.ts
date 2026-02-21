import { z } from "zod";

export const createHeadingSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(200),
  sortOrder: z.number().int().optional(),
});

export const updateHeadingSchema = createHeadingSchema
  .omit({ projectId: true })
  .partial();
