import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { ensureTenantAndWalletForUser } from "@/lib/tenant";
import { readSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1);

  if (!existing) {
    await db.insert(schema.users).values({
      id: session.userId,
      email: session.email ?? `${session.userId}@supabase.local`,
      name: session.email?.split("@")[0] ?? "Workspace",
      passwordHash: "supabase-auth",
    });
  }

  const workspace = await ensureTenantAndWalletForUser(session.userId);
  return NextResponse.json({ ok: true, ...workspace });
}
