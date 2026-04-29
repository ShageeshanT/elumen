import { NextResponse } from "next/server";
import { assertInternalAuthorized, UnauthorizedInternal } from "@/lib/internal-auth";
import { db, schema } from "@/db";
import { asc, eq } from "drizzle-orm";

export const runtime = "nodejs";

/** Worker picks next pending WhatsApp pairing. */
export async function GET(request: Request) {
  try {
    assertInternalAuthorized(request);
  } catch (e) {
    if (e instanceof UnauthorizedInternal)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    throw e;
  }

  const rows = await db
    .select({ id: schema.whatsappPairings.id })
    .from(schema.whatsappPairings)
    .where(eq(schema.whatsappPairings.status, "pending"))
    .orderBy(asc(schema.whatsappPairings.createdAt))
    .limit(1);

  const id = rows[0]?.id;
  if (!id) return NextResponse.json({ pairingId: null });

  await db
    .update(schema.whatsappPairings)
    .set({ status: "connecting", updatedAt: new Date() })
    .where(eq(schema.whatsappPairings.id, id));

  return NextResponse.json({ pairingId: id });
}
