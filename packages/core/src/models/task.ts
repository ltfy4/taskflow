/** Status values for a task */
export type TaskStatus = "active" | "completed" | "cancelled";

/** Time slot for scheduled tasks */
export type TimeSlot = "morning" | "afternoon" | "evening";

/** Priority levels */
export type Priority = "none" | "low" | "medium" | "high";

/** Repeat configuration for recurring tasks */
export interface RepeatConfig {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
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
  scheduledDate: string | null;
  scheduledTimeSlot: TimeSlot | null;
  deadline: string | null;
  reminderAt: string | null;
  repeatConfig: RepeatConfig | null;
  priority: Priority;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields for creating a new task */
export interface CreateTask {
  title: string;
  projectId?: string | null;
  areaId?: string | null;
  headingId?: string | null;
  notes?: string | null;
  status?: TaskStatus;
  scheduledDate?: string | null;
  scheduledTimeSlot?: TimeSlot | null;
  deadline?: string | null;
  reminderAt?: string | null;
  repeatConfig?: RepeatConfig | null;
  priority?: Priority;
  sortOrder?: number;
}

/** Fields for updating an existing task */
export type UpdateTask = Partial<Omit<CreateTask, "title">> & {
  title?: string;
};
