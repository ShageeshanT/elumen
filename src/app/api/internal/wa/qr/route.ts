import { NextResponse } from "next/server";
import { z } from "zod";
import { assertInternalAuthorized, UnauthorizedInternal } from "@/lib/internal-auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const Body = z.object({
  pairingId: z.string().uuid(),
  qrPayload: z.string().min(4),
});

/** Worker posts fresh QR data for dashboard polling. */
export async function POST(request: Request) {
  try {
    assertInternalAuthorized(request);
  } catch (e) {
    if (e instanceof UnauthorizedInternal)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    throw e;
  }

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

  await db
    .update(schema.whatsappPairings)
    .set({
      status: "connecting",
      qrPayload: parsed.data.qrPayload,
      updatedAt: new Date(),
    })
    .where(eq(schema.whatsappPairings.id, parsed.data.pairingId));

  return NextResponse.json({ ok: true });
}
