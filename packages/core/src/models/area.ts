/** Core area entity */
export interface Area {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields for creating a new area */
export interface CreateArea {
  name: string;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
}

/** Fields for updating an existing area */
export type UpdateArea = Partial<CreateArea>;
