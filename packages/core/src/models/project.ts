/** Status values for a project */
export type ProjectStatus = "active" | "completed" | "cancelled";

/** Core project entity */
export interface Project {
  id: string;
  userId: string;
  areaId: string | null;
  name: string;
  notes: string | null;
  color: string | null;
  deadline: string | null;
  status: ProjectStatus;
  sortOrder: number;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Project with computed fields */
export interface ProjectWithCounts extends Project {
  taskCount: number;
  completedTaskCount: number;
}

/** Fields for creating a new project */
export interface CreateProject {
  name: string;
  areaId?: string | null;
  notes?: string | null;
  color?: string | null;
  deadline?: string | null;
  status?: ProjectStatus;
  sortOrder?: number;
}

/** Fields for updating an existing project */
export type UpdateProject = Partial<CreateProject>;
