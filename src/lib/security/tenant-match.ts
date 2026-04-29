export function assertTenantMatch(
  requestTenantId: string,
  expectedTenantId: string,
): void {
  if (requestTenantId !== expectedTenantId) {
    throw new Error("tenant_forbidden");
  }
}
