import type {
  InferenceGenerateInput,
  InferenceGenerateResult,
  InferencePort,
} from "@/lib/ports/inference";

/**
 * Placeholder “assistant” — no external model call; keeps stack names out of product.
 * Swap for a real InferencePort implementation in ops.
 */
export class EchoInferenceAdapter implements InferencePort {
  async generateReply(
    input: InferenceGenerateInput,
  ): Promise<InferenceGenerateResult> {
    const text = `Thanks for your message. Your assistant is active and received: ${input.userTurn.slice(0, 2000)}`;
    return {
      text,
      internalUsageApproxTokens: Math.ceil((input.userTurn.length + text.length) / 4),
    };
  }
}
