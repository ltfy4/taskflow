/** Status values for a project */
export type ProjectStatus = "active" | "completed" | "cancelled" | "on_hold";

/** Core project entity */
export interface Project {
  id: string;
  userId: string;
  areaId: string | null;
  name: string;
  notes: string | null;
  deadline: string | null;
  status: ProjectStatus;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  deadline?: string | null;
  status?: ProjectStatus;
  sortOrder?: number;
}

/** Fields for updating an existing project */
export type UpdateProject = Partial<CreateProject>;
