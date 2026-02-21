import { z } from "zod";

export const createChecklistItemSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1).max(500),
  completed: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateChecklistItemSchema = createChecklistItemSchema
  .omit({ taskId: true })
  .partial();
