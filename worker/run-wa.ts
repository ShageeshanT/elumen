/**
 * Separate Node process — run alongside Next.js:
 * INTERNAL_API_SECRET=… WORKER_ORIGIN=http://localhost:3000 npx tsx worker/run-wa.ts
 *
 * Picks pending "link chat" sessions, holds the WhatsApp Web session via Baileys,
 * pushes QR/state to the dashboard API and routes replies through orchestration.
 */
import fs from "node:fs";
import path from "node:path";

import makeWASocket from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import {
  DisconnectReason,
  useMultiFileAuthState as createMultiFileAuthState,
} from "@whiskeysockets/baileys";

const { WORKER_ORIGIN, INTERNAL_API_SECRET } = process.env;
if (!WORKER_ORIGIN || !INTERNAL_API_SECRET) {
  console.error("Set WORKER_ORIGIN and INTERNAL_API_SECRET");
  process.exit(1);
}

const base = WORKER_ORIGIN.replace(/\/$/, "");
const hdr = {
  Authorization: `Bearer ${INTERNAL_API_SECRET}`,
  "content-type": "application/json",
};

async function getJson(url: string) {
  const r = await fetch(url, { headers: hdr });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<{ pairingId?: string | null; tenantId?: string }>;
}

async function postJson(url: string, body: unknown) {
  const r = await fetch(url, {
    method: "POST",
    headers: hdr,
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let j: unknown = {};
  try {
    j = text ? JSON.parse(text) : {};
  } catch {
    j = { raw: text };
  }
  if (!r.ok) throw new Error(typeof j === "object" ? JSON.stringify(j) : text);
  return j as Record<string, unknown>;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPairingMeta(pairingId: string): Promise<{ tenantId: string }> {
  const j = await getJson(`${base}/api/internal/wa/pairing/${pairingId}`);
  if (!("tenantId" in j) || typeof j.tenantId !== "string") {
    throw new Error("pairing_meta");
  }
  return { tenantId: j.tenantId };
}

async function runOneSession(pairingId: string) {
  const { tenantId } = await fetchPairingMeta(pairingId);
  const authDir = path.join(process.cwd(), "data", "wa-auth", pairingId);
  fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await createMultiFileAuthState(authDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ["Elumen", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  const done = new Promise<void>((resolve) => {
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          await postJson(`${base}/api/internal/wa/qr`, {
            pairingId,
            qrPayload: qr,
          });
        } catch (e) {
          console.error("qr post failed", e);
        }
      }

      if (connection === "open") {
        try {
          const label = sock.user?.id?.split(":")[0] ?? "Linked";
          await postJson(`${base}/api/internal/wa/connected`, {
            pairingId,
            linkedLabel: label,
          });
        } catch (e) {
          console.error("connected post failed", e);
        }
      }

      if (connection === "close") {
        const code = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect =
          code !== DisconnectReason.loggedOut && code !== DisconnectReason.badSession;
        console.log("socket closed", code, "shouldReconnect", shouldReconnect);
        resolve();
      }
    });
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const m of messages) {
      const text =
        m.message?.conversation ??
        m.message?.extendedTextMessage?.text ??
        "";
      if (!text || !m.key.remoteJid) continue;
      const fromMe = Boolean(m.key.fromMe);
      const chatId = m.key.remoteJid;
      try {
        const res = (await postJson(`${base}/api/internal/wa/inbound`, {
          pairingId,
          tenantId,
          text,
          chatId,
          fromMe,
        })) as {
          ok?: boolean;
          replyText?: string;
          skipped?: boolean;
        };

        if (
          res.ok &&
          res.replyText &&
          !fromMe &&
          chatId.endsWith("@s.whatsapp.net")
        ) {
          await sock.sendMessage(chatId, { text: res.replyText });
        }
      } catch (e) {
        console.error("inbound chain failed", e);
      }
    }
  });

  await done;
}

async function main() {
  console.log("WhatsApp link worker started");
  for (;;) {
    try {
      const next = await getJson(`${base}/api/internal/wa/next`);
      const pairingId = next.pairingId;
      if (!pairingId) {
        await sleep(4000);
        continue;
      }
      console.log("Running session for pairing", pairingId);
      await runOneSession(pairingId);
    } catch (e) {
      console.error(e);
      await sleep(5000);
    }
  }
}

void main();
