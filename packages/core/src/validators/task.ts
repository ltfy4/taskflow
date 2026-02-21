import { z } from "zod";

export const taskStatusSchema = z.enum(["active", "completed", "cancelled"]);

export const timeSlotSchema = z.enum(["morning", "afternoon", "evening"]);

export const prioritySchema = z.enum(["none", "low", "medium", "high"]);

export const repeatConfigSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  interval: z.number().int().min(1),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  endDate: z.string().datetime().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  projectId: z.string().uuid().nullish(),
  areaId: z.string().uuid().nullish(),
  headingId: z.string().uuid().nullish(),
  notes: z.string().max(10000).nullish(),
  status: taskStatusSchema.optional(),
  scheduledDate: z.string().date().nullish(),
  scheduledTimeSlot: timeSlotSchema.nullish(),
  deadline: z.string().date().nullish(),
  reminderAt: z.string().datetime().nullish(),
  repeatConfig: repeatConfigSchema.nullish(),
  priority: prioritySchema.optional(),
  sortOrder: z.number().int().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
