"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

type Props = {
  pairingId: string | null;
};

export function WhatsAppQrPoller({ pairingId }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!pairingId) {
      setDataUrl(null);
      setStatus("");
      return;
    }
    let cancelled = false;
    const tick = async () => {
      const r = await fetch(`/api/whatsapp/pairings/${pairingId}`);
      if (!r.ok) return;
      const j = (await r.json()) as {
        status?: string;
        qrPayload?: string | null;
        linkedLabel?: string | null;
      };
      if (cancelled) return;
      setStatus(j.status ?? "");
      if (j.qrPayload) {
        try {
          const url = await QRCode.toDataURL(j.qrPayload, {
            margin: 1,
            width: 260,
          });
          if (!cancelled) setDataUrl(url);
        } catch {
          setDataUrl(null);
        }
      }
      if (j.status === "connected") {
        setDataUrl(null);
      }
    };
    void tick();
    const id = window.setInterval(tick, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [pairingId]);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/35 p-4 shadow-inner">
      {!pairingId ? (
        <p className="text-sm text-white/55">
          Start a linking session below.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white/55">
            Status: {status || "starting…"}
          </p>
          {dataUrl && status !== "connected" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="QR to link WhatsApp"
              src={dataUrl}
              className="rounded-2xl border border-white/20 bg-white p-2 shadow-2xl"
              width={260}
              height={260}
            />
          ) : status === "connected" ? (
            <p className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              Linked and ready — your assistant will answer new chats when
              credits allow.
            </p>
          ) : (
            <p className="text-center text-sm text-white/55">
              Waiting for a QR… keep this page open until the scanner appears.
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Use responsibly and in line with WhatsApp terms. Automated messaging
        can risk account restriction.
      </p>
    </div>
  );
}

