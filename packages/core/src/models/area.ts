/** Core area entity */
export interface Area {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  collapsed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Fields for creating a new area */
export interface CreateArea {
  name: string;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  collapsed?: boolean;
}

/** Fields for updating an existing area */
export type UpdateArea = Partial<CreateArea>;
