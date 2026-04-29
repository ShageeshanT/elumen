import { NextResponse } from "next/server";
import { assertInternalAuthorized, UnauthorizedInternal } from "@/lib/internal-auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ pairingId: string }> },
) {
  try {
    assertInternalAuthorized(request);
  } catch (e) {
    if (e instanceof UnauthorizedInternal)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    throw e;
  }
  const { pairingId } = await ctx.params;
  const [row] = await db
    .select({
      id: schema.whatsappPairings.id,
      tenantId: schema.whatsappPairings.tenantId,
      status: schema.whatsappPairings.status,
    })
    .from(schema.whatsappPairings)
    .where(eq(schema.whatsappPairings.id, pairingId))
    .limit(1);

  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(row);
}
