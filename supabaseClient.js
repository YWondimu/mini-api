// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Fail fast if envs are missing (don’t print secrets)
const required = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

