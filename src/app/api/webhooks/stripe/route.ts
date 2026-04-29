import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/obs/logger";
import { creditFromStripe } from "@/lib/billing/wallet";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const env = getEnv();
  const secret = env.STRIPE_SECRET_KEY;
  const wh = env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !wh) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret, { typescript: true });
  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, wh);
  } catch {
    logger.warn({ err: true }, "stripe_webhook_bad_signature");
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  logger.info({ event: event.type }, "stripe_webhook");

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantId =
      session.metadata?.tenantId ?? session.client_reference_id;
    if (tenantId && session.payment_status === "paid") {
      const pack = getEnv().CREDITS_PER_PURCHASE_PACKAGE;
      await creditFromStripe({
        tenantId,
        amountCents: pack,
        stripeSessionId: session.id,
        description: "Credit pack purchase",
      });
    }
  }

  return NextResponse.json({ received: true });
}
