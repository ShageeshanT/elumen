import { describe, it, expect } from "vitest";
import { assertTenantMatch } from "@/lib/security/tenant-match";

describe("assertTenantMatch", () => {
  it("allows equal ids", () => {
    expect(() => assertTenantMatch("tenant-a", "tenant-a")).not.toThrow();
  });

  it("blocks mismatch", () => {
    expect(() => assertTenantMatch("tenant-a", "tenant-b")).toThrow(
      "tenant_forbidden",
    );
  });
});
