import { hasSupabaseBrowserEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionPayload = {
  userId: string;
  email?: string;
};

export async function clearSession(): Promise<void> {
  if (!hasSupabaseBrowserEnv()) return;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

/** Use in Route Handlers and Server Components. */
export async function readSession(): Promise<SessionPayload | null> {
  if (!hasSupabaseBrowserEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return {
    userId: user.id,
    email: user.email ?? undefined,
  };
}
