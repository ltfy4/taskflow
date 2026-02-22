-- ============================================
-- Performance Indexes
-- Technical Spec §4.2
-- ============================================

-- Tasks: most queried table
CREATE INDEX IF NOT EXISTS idx_tasks_user_id
  ON public.tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_date
  ON public.tasks(user_id, scheduled_date)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON public.tasks(user_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_project_id
  ON public.tasks(project_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_deadline
  ON public.tasks(user_id, deadline)
  WHERE deadline IS NOT NULL AND deleted_at IS NULL;

-- Areas
CREATE INDEX IF NOT EXISTS idx_areas_user_id
  ON public.areas(user_id)
  WHERE deleted_at IS NULL;

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id
  ON public.projects(user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_projects_area_id
  ON public.projects(area_id)
  WHERE deleted_at IS NULL;

-- Headings
CREATE INDEX IF NOT EXISTS idx_headings_project_id
  ON public.headings(project_id)
  WHERE deleted_at IS NULL;

-- Checklist items
CREATE INDEX IF NOT EXISTS idx_checklist_items_task_id
  ON public.checklist_items(task_id)
  WHERE deleted_at IS NULL;

-- Full-text search on tasks
CREATE INDEX IF NOT EXISTS idx_tasks_search
  ON public.tasks USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(notes, ''))
  );
