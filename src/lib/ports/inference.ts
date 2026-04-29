/** Internal-only labels for adapters; never sent to tenants. */

export interface InferenceGenerateInput {
  tenantId: string;
  conversationId: string;
  instructions: string;
  userTurn: string;
}

export interface InferenceGenerateResult {
  /** Opaque assistant turn for auditing; omit model id from tenant surfaces. */
  text: string;
  internalUsageApproxTokens?: number;
}

/** Swappable LLM / agent backends (implementation names stay private). */
export interface InferencePort {
  generateReply(input: InferenceGenerateInput): Promise<InferenceGenerateResult>;
}
