import { router } from "./trpc";
import { tasksRouter } from "./routers/tasks";
import { projectsRouter } from "./routers/projects";
import { areasRouter } from "./routers/areas";

export const appRouter = router({
  tasks: tasksRouter,
  projects: projectsRouter,
  areas: areasRouter,
});

export type AppRouter = typeof appRouter;

export { type Context } from "./trpc";
