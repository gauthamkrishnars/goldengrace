import { createClient } from "@supabase/supabase-js";

// Server-side client with service role key (bypasses RLS)
// Use this in API routes, NOT in client components
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // Fallback to anon key (will be subject to RLS)
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set, using anon key. RLS policies will be enforced.");
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, anonKey);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
