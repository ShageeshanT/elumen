import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ agents: [] });

  const rows = await db
    .select()
    .from(schema.agents)
    .where(eq(schema.agents.tenantId, tenant.tenantId));
  return NextResponse.json({ agents: rows });
}

const Body = z.object({
  name: z.string().min(1).max(120),
  instructions: z.string().max(16_000).optional(),
});

export async function POST(request: Request) {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const tenant = await getTenantForUser(s.userId);
  if (!tenant) {
    return NextResponse.json({ error: "no_tenant" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(schema.agents).values({
    id,
    tenantId: tenant.tenantId,
    name: parsed.data.name,
    instructions: parsed.data.instructions ?? "",
  });

  const [row] = await db
    .select()
    .from(schema.agents)
    .where(eq(schema.agents.id, id))
    .limit(1);

  return NextResponse.json({ agent: row });
}
