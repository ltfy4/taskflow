import { z } from "zod";

export const projectStatusSchema = z.enum([
  "active",
  "completed",
  "cancelled",
  "on_hold",
]);

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  areaId: z.string().uuid().nullish(),
  notes: z.string().max(10000).nullish(),
  deadline: z.string().date().nullish(),
  status: projectStatusSchema.optional(),
  sortOrder: z.number().int().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
