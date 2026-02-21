/** Core checklist item entity (subtasks within a task) */
export interface ChecklistItem {
  id: string;
  userId: string;
  taskId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields for creating a new checklist item */
export interface CreateChecklistItem {
  taskId: string;
  title: string;
  completed?: boolean;
  sortOrder?: number;
}

/** Fields for updating an existing checklist item */
export type UpdateChecklistItem = Partial<Omit<CreateChecklistItem, "taskId">>;
