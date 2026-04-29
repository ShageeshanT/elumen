import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/** Poll QR / status for one pairing (same tenant only). */
export async function GET(
  _: Request,
  ctx: { params: Promise<{ pairingId: string }> },
) {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { pairingId } = await ctx.params;

  const [row] = await db
    .select()
    .from(schema.whatsappPairings)
    .where(eq(schema.whatsappPairings.id, pairingId))
    .limit(1);

  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const [u] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.id, s.userId))
    .limit(1);
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tenantMatch = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, row.tenantId))
    .limit(1);

  if (tenantMatch[0]?.ownerUserId !== s.userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    status: row.status,
    /** Base64 image or raw string for QR rendering */
    qrPayload: row.qrPayload,
    linkedLabel: row.linkedLabel,
    updatedAt: row.updatedAt?.getTime?.() ?? Date.now(),
  });
}
