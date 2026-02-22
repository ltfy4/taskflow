/** Core tag entity */
export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  createdAt: string;
}

/** Junction table for task-tag relationship */
export interface TaskTag {
  taskId: string;
  tagId: string;
}

/** Fields for creating a new tag */
export interface CreateTag {
  name: string;
  color?: string | null;
}

/** Fields for updating an existing tag */
export type UpdateTag = Partial<CreateTag>;
