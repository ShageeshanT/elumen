import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { getWalletForTenant } from "@/lib/billing/wallet";

export const runtime = "nodejs";

export async function GET() {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ balanceCents: 0 });

  const w = await getWalletForTenant(tenant.tenantId);
  return NextResponse.json({
    balanceCents: w?.balanceCents ?? 0,
  });
}
