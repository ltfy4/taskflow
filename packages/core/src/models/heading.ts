/** Core heading entity (section dividers within projects) */
export interface Heading {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields for creating a new heading */
export interface CreateHeading {
  projectId: string;
  title: string;
  sortOrder?: number;
}

/** Fields for updating an existing heading */
export type UpdateHeading = Partial<Omit<CreateHeading, "projectId">>;
