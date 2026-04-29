/** Messaging connectors (Baileys-backed implementation is internal only). */

export type MessagingChannelKind = "whatsapp_web";

export interface NormalizedInboundMessage {
  tenantId: string;
  connectionLocalId: string;
  chatId: string;
  /** Safe text excerpt for automation */
  text: string;
  fromMe: boolean;
}

export interface SendOutboundArgs {
  tenantId: string;
  connectionLocalId: string;
  chatId: string;
  text: string;
}

export interface MessagingPort {
  sendOutbound(args: SendOutboundArgs): Promise<{ ok: boolean; error?: string }>;
}
