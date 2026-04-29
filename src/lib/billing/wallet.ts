import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import crypto from "node:crypto";

/** Cost for one automated conversation turn (tunable). */
export const DEBIT_AUTOMATION_TURN_CENTS = 2;

export async function getWalletForTenant(tenantId: string) {
  const [w] = await db
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.tenantId, tenantId))
    .limit(1);
  return w ?? null;
}

export async function creditFromStripe(params: {
  tenantId: string;
  amountCents: number;
  stripeSessionId: string;
  description?: string;
}): Promise<void> {
  const [dup] = await db
    .select({ id: schema.walletTransactions.id })
    .from(schema.walletTransactions)
    .where(
      eq(schema.walletTransactions.stripeCheckoutSessionId, params.stripeSessionId),
    )
    .limit(1);
  if (dup) return;

  await db.transaction((tx) => {
    return (async () => {
      const [w] = await tx
        .select()
        .from(schema.wallets)
        .where(eq(schema.wallets.tenantId, params.tenantId))
        .limit(1);
      if (!w) throw new Error("wallet_not_found");

      await tx
        .update(schema.wallets)
        .set({
          balanceCents: sql`${schema.wallets.balanceCents} + ${params.amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(schema.wallets.id, w.id));

      await tx.insert(schema.walletTransactions).values({
        id: crypto.randomUUID(),
        walletId: w.id,
        kind: "stripe_checkout",
        amountCents: params.amountCents,
        stripeCheckoutSessionId: params.stripeSessionId,
        description: params.description ?? "Credit purchase",
      });
    })();
  });
}

export async function debitForAutomation(params: {
  tenantId: string;
  amountCents: number;
  kind: string;
  description: string;
}): Promise<{ ok: true } | { ok: false; reason: "insufficient" }> {
  return db.transaction(async (tx) => {
    const [w] = await tx
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.tenantId, params.tenantId))
      .limit(1);
    if (!w) return { ok: false, reason: "insufficient" };
    if (w.balanceCents < params.amountCents)
      return { ok: false, reason: "insufficient" };

    await tx
      .update(schema.wallets)
      .set({
        balanceCents: sql`${schema.wallets.balanceCents} - ${params.amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.wallets.id, w.id));

    await tx.insert(schema.walletTransactions).values({
      id: crypto.randomUUID(),
      walletId: w.id,
      kind: params.kind,
      amountCents: -params.amountCents,
      description: params.description,
    });

    return { ok: true };
  });
}
