import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { ensureTenantAndWalletForUser } from "@/lib/tenant";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120),
});

export async function POST(request: Request) {
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
  const { email, password, name } = parsed.data;

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  if (existing.length) {
    return NextResponse.json({ error: "email_in_use" }, { status: 409 });
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.insert(schema.users).values({
    id,
    email: email.toLowerCase(),
    passwordHash,
    name,
  });

  await ensureTenantAndWalletForUser(id);
  await createSession({ userId: id });

  return NextResponse.json({ ok: true, userId: id });
}
