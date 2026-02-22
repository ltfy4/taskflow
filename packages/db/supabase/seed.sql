-- ============================================
-- Seed Data for Development
-- ============================================
-- NOTE: This requires a test user to already exist in auth.users.
-- Create a test user via Supabase Auth first, then replace the UUID below.
-- The handle_new_user trigger will auto-create the profile.

-- After creating the user, run this with the user's UUID:
-- Replace 'USER_ID_HERE' with actual UUID from auth.users

-- For convenience, you can create a test user via Supabase dashboard:
-- Authentication > Users > Add User
-- Email: test@taskflow.dev / Password: testpassword123

-- Then get the UUID and run:
-- UPDATE the variable below:

DO $$
DECLARE
  test_user_id UUID;
  area_personal UUID;
  area_work UUID;
  project_app UUID;
  project_fitness UUID;
  heading_design UUID;
  heading_dev UUID;
  tag_urgent UUID;
  tag_important UUID;
  tag_learning UUID;
BEGIN
  -- Get the first user (test user)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found. Create a user first via Supabase Auth dashboard.';
    RETURN;
  END IF;

  RAISE NOTICE 'Seeding data for user: %', test_user_id;

  -- ---- AREAS ----
  area_personal := gen_random_uuid();
  area_work := gen_random_uuid();

  INSERT INTO public.areas (id, user_id, name, icon, color, sort_order)
  VALUES
    (area_personal, test_user_id, 'Personal', '🏠', '#6366F1', 0),
    (area_work, test_user_id, 'Work', '💼', '#F59E0B', 1);

  -- ---- PROJECTS ----
  project_app := gen_random_uuid();
  project_fitness := gen_random_uuid();

  INSERT INTO public.projects (id, user_id, area_id, name, notes, status, sort_order)
  VALUES
    (project_app, test_user_id, area_work, 'TaskFlow App', 'Build the best task manager', 'active', 0),
    (project_fitness, test_user_id, area_personal, 'Fitness Journey', 'Get in shape for summer', 'active', 0);

  -- ---- HEADINGS ----
  heading_design := gen_random_uuid();
  heading_dev := gen_random_uuid();

  INSERT INTO public.headings (id, user_id, project_id, title, sort_order)
  VALUES
    (heading_design, test_user_id, project_app, 'Design', 0),
    (heading_dev, test_user_id, project_app, 'Development', 1);

  -- ---- TAGS ----
  tag_urgent := gen_random_uuid();
  tag_important := gen_random_uuid();
  tag_learning := gen_random_uuid();

  INSERT INTO public.tags (id, user_id, name, color)
  VALUES
    (tag_urgent, test_user_id, 'urgent', '#EF4444'),
    (tag_important, test_user_id, 'important', '#F59E0B'),
    (tag_learning, test_user_id, 'learning', '#3B82F6');

  -- ---- TASKS ----
  -- Today tasks
  INSERT INTO public.tasks (user_id, project_id, heading_id, title, notes, status, priority, scheduled_date, sort_order)
  VALUES
    (test_user_id, project_app, heading_design, 'Design the sidebar navigation', 'Use Figma for mockups. Reference Things 3 for inspiration.', 'active', 'high', CURRENT_DATE, 0),
    (test_user_id, project_app, heading_dev, 'Set up PowerSync integration', NULL, 'active', 'high', CURRENT_DATE, 1),
    (test_user_id, NULL, NULL, 'Buy groceries', 'Milk, eggs, bread, avocados', 'active', 'none', CURRENT_DATE, 2);

  -- Evening task
  INSERT INTO public.tasks (user_id, title, status, scheduled_date, scheduled_time_slot, sort_order)
  VALUES
    (test_user_id, 'Read chapter 5 of Atomic Habits', 'active', CURRENT_DATE, 'evening', 3);

  -- Upcoming tasks
  INSERT INTO public.tasks (user_id, project_id, title, status, scheduled_date, deadline, sort_order)
  VALUES
    (test_user_id, project_fitness, 'Sign up for gym membership', 'active', CURRENT_DATE + 1, CURRENT_DATE + 3, 0),
    (test_user_id, project_app, 'Write API documentation', 'active', CURRENT_DATE + 2, NULL, 1);

  -- Inbox tasks (no scheduled date)
  INSERT INTO public.tasks (user_id, title, notes, status, sort_order)
  VALUES
    (test_user_id, 'Research PowerSync alternatives', 'Look into ElectricSQL and rxdb', 'active', 0),
    (test_user_id, 'Call dentist for appointment', NULL, 'active', 1);

  -- Someday tasks (no date, parked)
  INSERT INTO public.tasks (user_id, title, status, sort_order)
  VALUES
    (test_user_id, 'Learn Rust programming', 'active', 0),
    (test_user_id, 'Plan trip to Japan', 'active', 1);

  -- Completed task
  INSERT INTO public.tasks (user_id, project_id, title, status, completed_at, scheduled_date, sort_order)
  VALUES
    (test_user_id, project_app, 'Set up monorepo structure', 'completed', NOW(), CURRENT_DATE - 1, 0);

  -- Overdue task
  INSERT INTO public.tasks (user_id, title, status, scheduled_date, deadline, priority, sort_order)
  VALUES
    (test_user_id, 'Submit tax documents', 'active', CURRENT_DATE - 3, CURRENT_DATE - 1, 'high', 0);

  -- ---- CHECKLIST ITEMS ----
  INSERT INTO public.checklist_items (user_id, task_id, title, completed, sort_order)
  SELECT test_user_id, t.id, item.title, item.completed, item.sort_order
  FROM public.tasks t
  CROSS JOIN (
    VALUES
      ('Create wireframes', TRUE, 0),
      ('Get feedback from team', FALSE, 1),
      ('Finalize color palette', FALSE, 2)
  ) AS item(title, completed, sort_order)
  WHERE t.title = 'Design the sidebar navigation' AND t.user_id = test_user_id;

  -- ---- TASK_TAGS ----
  INSERT INTO public.task_tags (task_id, tag_id)
  SELECT t.id, tag_urgent
  FROM public.tasks t WHERE t.title = 'Submit tax documents' AND t.user_id = test_user_id;

  INSERT INTO public.task_tags (task_id, tag_id)
  SELECT t.id, tag_important
  FROM public.tasks t WHERE t.title = 'Set up PowerSync integration' AND t.user_id = test_user_id;

  INSERT INTO public.task_tags (task_id, tag_id)
  SELECT t.id, tag_learning
  FROM public.tasks t WHERE t.title = 'Learn Rust programming' AND t.user_id = test_user_id;

  RAISE NOTICE 'Seed data created successfully!';
END $$;
