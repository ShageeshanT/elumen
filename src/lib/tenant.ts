import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import crypto from "node:crypto";

/** Every user gets exactly one tenant in MVP shape. */

export async function ensureTenantAndWalletForUser(
  userId: string,
): Promise<{ tenantId: string; walletId: string }> {
  let [tenantRow] = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.ownerUserId, userId))
    .limit(1);

  if (!tenantRow) {
    const [userRow] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);
    const tid = crypto.randomUUID();
    await db.insert(schema.tenants).values({
      id: tid,
      ownerUserId: userId,
      name: `${userRow?.name ?? "Workspace"} Workspace`,
    });
    tenantRow = {
      id: tid,
      ownerUserId: userId,
      name: `${userRow?.name ?? "Workspace"} Workspace`,
      createdAt: new Date(),
    };
  }

  let [walletRow] = await db
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.tenantId, tenantRow.id))
    .limit(1);

  if (!walletRow) {
    const walletId = crypto.randomUUID();
    await db.insert(schema.wallets).values({
      id: walletId,
      tenantId: tenantRow.id,
      balanceCents: 5000,
    });
    await db.insert(schema.walletTransactions).values({
      id: crypto.randomUUID(),
      walletId,
      kind: "signup_bonus",
      amountCents: 5000,
      description: "Welcome credits",
    });
    [walletRow] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.id, walletId))
      .limit(1);
  }

  if (!walletRow) throw new Error("wallet_creation_failed");

  return {
    tenantId: tenantRow.id,
    walletId: walletRow.id,
  };
}

export async function getTenantForUser(
  userId: string,
): Promise<{ tenantId: string } | null> {
  const [t] = await db
    .select({ id: schema.tenants.id })
    .from(schema.tenants)
    .where(eq(schema.tenants.ownerUserId, userId))
    .limit(1);
  return t ? { tenantId: t.id } : null;
}
