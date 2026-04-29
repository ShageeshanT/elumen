/** Composio, MCP routers, HTTP toolkits behind one internal surface. */

export interface ToolInvocationContext {
  tenantId: string;
  toolkitHints?: string[];
}

export interface ToolProviderPort {
  /**
   * Returns opaque handle for MCP session if applicable (server-side only).
   */
  prepareSessionForTenant(
    ctx: ToolInvocationContext,
    composioUserId: string,
  ): Promise<{ sessionReady: boolean; note?: string }>;
}
