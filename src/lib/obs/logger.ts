import pino from "pino";

/** Structured logs for API routes — never log secrets or WhatsApp payloads in full at info level. */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});
