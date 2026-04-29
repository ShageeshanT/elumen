import { Composio } from "@composio/core";
import { getEnv } from "@/lib/env";
import type { ToolInvocationContext, ToolProviderPort } from "@/lib/ports/tool-provider";

export class ComposioToolAdapter implements ToolProviderPort {
  private client(): Composio {
    const key = getEnv().COMPOSIO_API_KEY;
    if (!key)
      throw new Error("integrations_unavailable_configure_on_server");
    return new Composio({ apiKey: key });
  }

  async prepareSessionForTenant(
    _ctx: ToolInvocationContext,
    composioUserId: string,
  ): Promise<{ sessionReady: boolean; note?: string }> {
    const c = this.client();
    await c.create(composioUserId, { manageConnections: true });
    return {
      sessionReady: true,
      note: "Session established for connected tools when you authorize integrations.",
    };
  }
}
