import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const s = await readSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });

  const [u] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
    })
    .from(schema.users)
    .where(eq(schema.users.id, s.userId))
    .limit(1);

  const tenant = await getTenantForUser(s.userId);
  const wallet = tenant
    ? await db
        .select({ balanceCents: schema.wallets.balanceCents })
        .from(schema.wallets)
        .where(eq(schema.wallets.tenantId, tenant.tenantId))
        .limit(1)
    : [];

  return NextResponse.json({
    user: u,
    tenantId: tenant?.tenantId ?? null,
    wallet: wallet[0] ?? null,
  });
}
