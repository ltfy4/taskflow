import { createClient } from "@supabase/supabase-js";

/** Environment variables required for Supabase connection */
interface SupabaseEnv {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

/**
 * Creates a Supabase client for browser/client-side usage.
 * Uses the anon key for RLS-protected queries.
 */
export function createBrowserClient(env: SupabaseEnv) {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Creates a Supabase client for server-side usage.
 * Uses the service role key to bypass RLS when needed.
 */
export function createServerClient(env: SupabaseEnv) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server client");
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
}
