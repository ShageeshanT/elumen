import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEnv } from "@/lib/env";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";

export const runtime = "nodejs";

export async function POST() {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = getEnv().STRIPE_SECRET_KEY;
  const price = getEnv().STRIPE_PRICE_ID_CREDITS;
  if (!key || !price) {
    return NextResponse.json(
      { error: "billing_not_configured" },
      { status: 503 },
    );
  }

  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const stripe = new Stripe(key, { typescript: true });

  const base = getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    success_url: `${base}/dashboard/billing?status=success`,
    cancel_url: `${base}/dashboard/billing?status=cancel`,
    client_reference_id: tenant.tenantId,
    metadata: { tenantId: tenant.tenantId },
  });

  return NextResponse.json({ url: session.url });
}
