import {
  debitForAutomation,
  DEBIT_AUTOMATION_TURN_CENTS,
} from "@/lib/billing/wallet";
import { EchoInferenceAdapter } from "@/lib/adapters/simple-inference";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

const inference = new EchoInferenceAdapter();

export async function orchestrateInboundEvent(params: {
  tenantId: string;
  pairingId: string | null;
  payload: {
    text: string;
    chatId?: string;
    fromMe?: boolean;
  };
}) {
  if (params.payload.fromMe) {
    return { skipped: true as const };
  }

  const debit = await debitForAutomation({
    tenantId: params.tenantId,
    amountCents: DEBIT_AUTOMATION_TURN_CENTS,
    kind: "automation_turn",
    description: "Processed incoming message",
  });

  if (!debit.ok) {
    await db.insert(schema.inboundEvents).values({
      id: crypto.randomUUID(),
      tenantId: params.tenantId,
      pairingId: params.pairingId,
      channel: "whatsapp",
      payloadJson: JSON.stringify({
        ...params.payload,
        insufficientCredits: true,
      }),
      processedAt: new Date(),
    });
    return { ok: false as const, reason: "insufficient_credits" as const };
  }

  const [agentRow] = await db
    .select()
    .from(schema.agents)
    .where(eq(schema.agents.tenantId, params.tenantId))
    .limit(1);

  const instructions =
    agentRow?.instructions ??
    "You help the user politely and briefly on WhatsApp.";

  const reply = await inference.generateReply({
    tenantId: params.tenantId,
    conversationId: params.pairingId ?? params.tenantId,
    instructions,
    userTurn: params.payload.text,
  });

  await db.insert(schema.inboundEvents).values({
    id: crypto.randomUUID(),
    tenantId: params.tenantId,
    pairingId: params.pairingId,
    channel: "whatsapp",
    payloadJson: JSON.stringify({
      userText: params.payload.text,
      assistantPreview: reply.text.slice(0, 500),
    }),
    processedAt: new Date(),
  });

  return {
    ok: true as const,
    replyText: reply.text,
    chatId: params.payload.chatId ?? "",
  };
}
