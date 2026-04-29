import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { getEnv } from "@/lib/env";
import { Composio } from "@composio/core";

export const runtime = "nodejs";

const Body = z.object({
  toolkitSlug: z.string().min(1).max(64),
});

/**
 * Starts OAuth for a toolkit (e.g. gmail). Returns redirect URL for the browser.
 */
export async function POST(request: Request) {
  const s = await readSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tenant = await getTenantForUser(s.userId);
  if (!tenant) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

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

  const key = getEnv().COMPOSIO_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "integrations_not_configured" },
      { status: 503 },
    );
  }

  const composioUserId = `elumen_${tenant.tenantId}`;
  const composio = new Composio({ apiKey: key });

  try {
    const callbackUrl = `${getEnv().NEXT_PUBLIC_APP_URL}/dashboard/connections?status=connected`;
    const req = await composio.toolkits.authorize(
      composioUserId,
      parsed.data.toolkitSlug,
    );
    const redirectUrl = req.redirectUrl ?? null;
    if (!redirectUrl) {
      return NextResponse.json(
        { error: "no_redirect", detail: "Connection may already be active or pending." },
        { status: 502 },
      );
    }
    return NextResponse.json({
      redirectUrl,
      callbackUrl,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "composio_failed" },
      { status: 502 },
    );
  }
}
