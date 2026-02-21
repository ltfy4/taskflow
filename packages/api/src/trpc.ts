import { initTRPC, TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Context passed to every tRPC procedure */
export interface Context {
  supabase: SupabaseClient;
  userId: string | null;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/** Middleware that requires authentication */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
