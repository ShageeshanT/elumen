import { NextResponse } from "next/server";
import { z } from "zod";
import { assertInternalAuthorized, UnauthorizedInternal } from "@/lib/internal-auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { orchestrateInboundEvent } from "@/lib/orchestration/index";

export const runtime = "nodejs";

const Body = z.object({
  pairingId: z.string().uuid(),
  tenantId: z.string().uuid(),
  text: z.string().min(1),
  chatId: z.string().min(1),
  fromMe: z.boolean().optional(),
});

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

  const [p] = await db
    .select()
    .from(schema.whatsappPairings)
    .where(eq(schema.whatsappPairings.id, parsed.data.pairingId))
    .limit(1);

  if (!p || p.tenantId !== parsed.data.tenantId) {
    return NextResponse.json({ error: "pairing_mismatch" }, { status: 400 });
  }

  const result = await orchestrateInboundEvent({
    tenantId: parsed.data.tenantId,
    pairingId: parsed.data.pairingId,
    payload: {
      text: parsed.data.text,
      chatId: parsed.data.chatId,
      fromMe: parsed.data.fromMe,
    },
  });

  return NextResponse.json(result);
}
