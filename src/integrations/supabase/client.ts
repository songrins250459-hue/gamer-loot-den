// Supabase client initialization with safe local fallbacks and input sanitization.
// IMPORTANT: Do NOT put service_role (secret) keys in frontend env files.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const FALLBACK_SUPABASE_URL = "https://qyxcfocbractvmtvbakd.supabase.co";
const FALLBACK_PUBLISHABLE_KEY = "sb_publishable_PcbGvmTqPTkllYm7oJfZgQ_xDSab5o4";

function stripQuotes(value: unknown) {
  if (typeof value !== "string") return value;
  return value.replace(/^["']|["']$/g, "");
}

// Accept either a full URL in VITE_SUPABASE_URL or a project id in VITE_SUPABASE_PROJECT_ID
const rawUrlEnv = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_PROJECT_ID;
let computedUrl = stripQuotes(rawUrlEnv) as string | undefined;

if (computedUrl && !/^https?:\/\//i.test(computedUrl)) {
  // If it looks like a project id (alphanumeric + hyphens), build the URL.
  if (/^[a-z0-9\-]+$/i.test(computedUrl)) {
    computedUrl = `https://${computedUrl}.supabase.co`;
  } else {
    computedUrl = undefined;
  }
}

const SUPABASE_URL = computedUrl ?? FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  (stripQuotes(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined) ??
  FALLBACK_PUBLISHABLE_KEY;

if (!/^https?:\/\//i.test(SUPABASE_URL)) {
  // eslint-disable-next-line no-console
  console.error("[supabase] Invalid SUPABASE_URL after processing:", SUPABASE_URL);
}

// Log the resolved URL/key presence (do not print secrets)
/* eslint-disable no-console */
console.warn("[supabase] resolved URL:", SUPABASE_URL);
console.warn(
  "[supabase] publishable key present:",
  Boolean(SUPABASE_PUBLISHABLE_KEY) && String(SUPABASE_PUBLISHABLE_KEY).length > 0,
);
/* eslint-enable no-console */

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});


