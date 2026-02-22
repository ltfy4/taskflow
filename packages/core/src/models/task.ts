/** Status values for a task */
export type TaskStatus = "active" | "completed" | "cancelled";

/** Time slot for scheduled tasks */
export type TimeSlot = "morning" | "evening";

/** Priority levels */
export type Priority = "none" | "low" | "medium" | "high";

/** Repeat configuration for recurring tasks */
export interface RepeatConfig {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly" | "custom";
  daysOfWeek?: ("MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN")[];
  dayOfMonth?: number;
  interval?: number;
}

/** Core task entity */
export interface Task {
  id: string;
  userId: string;
  projectId: string | null;
  areaId: string | null;
  headingId: string | null;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: Priority;
  scheduledDate: string | null;
  scheduledTimeSlot: TimeSlot | null;
  deadline: string | null;
  reminderAt: string | null;
  repeatConfig: RepeatConfig | null;
  sortOrder: number;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Fields for creating a new task */
export interface CreateTask {
  title: string;
  projectId?: string | null;
  areaId?: string | null;
  headingId?: string | null;
  notes?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  scheduledDate?: string | null;
  scheduledTimeSlot?: TimeSlot | null;
  deadline?: string | null;
  reminderAt?: string | null;
  repeatConfig?: RepeatConfig | null;
  tagIds?: string[];
  sortOrder?: number;
}

/** Fields for updating an existing task */
export type UpdateTask = Partial<CreateTask>;
