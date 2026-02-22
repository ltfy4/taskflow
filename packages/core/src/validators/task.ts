import { z } from "zod";

export const taskStatusSchema = z.enum(["active", "completed", "cancelled"]);

export const timeSlotSchema = z.enum(["morning", "evening"]);

export const prioritySchema = z.enum(["none", "low", "medium", "high"]);

export const repeatConfigSchema = z.object({
  frequency: z.enum([
    "daily",
    "weekly",
    "biweekly",
    "monthly",
    "yearly",
    "custom",
  ]),
  daysOfWeek: z
    .array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]))
    .optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  interval: z.number().min(1).optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  notes: z.string().optional(),
  projectId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  headingId: z.string().uuid().optional(),
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  scheduledTimeSlot: timeSlotSchema.optional(),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  reminderAt: z.string().datetime().optional(),
  repeatConfig: repeatConfigSchema.optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  priority: prioritySchema.default("none"),
});

export const updateTaskSchema = createTaskSchema.partial();
