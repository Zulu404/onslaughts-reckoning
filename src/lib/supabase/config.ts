export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The site deploys on every push, so sign-in has to be able to be switched off
 * by the absence of configuration rather than by crashing the landing page.
 * Every auth path checks this first and falls back to a "coming soon" state.
 */
export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
