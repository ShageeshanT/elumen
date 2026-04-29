import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const runtime = "nodejs";

/** Create a new "link chat" session (QR flow). */
export async function POST() {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const id = crypto.randomUUID();
  await db.insert(schema.whatsappPairings).values({
    id,
    tenantId: tenant.tenantId,
    userId: s.userId,
    status: "pending",
    qrPayload: null,
  });

  return NextResponse.json({ pairingId: id });
}

export async function GET() {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ pairings: [] });

  const rows = await db
    .select({
      id: schema.whatsappPairings.id,
      status: schema.whatsappPairings.status,
      qrPayload: schema.whatsappPairings.qrPayload,
      linkedLabel: schema.whatsappPairings.linkedLabel,
      updatedAt: schema.whatsappPairings.updatedAt,
    })
    .from(schema.whatsappPairings)
    .where(eq(schema.whatsappPairings.tenantId, tenant.tenantId));

  return NextResponse.json({ pairings: rows });
}
