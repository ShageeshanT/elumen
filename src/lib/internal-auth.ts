import { getEnv } from "@/lib/env";

export function assertInternalAuthorized(request: Request): void {
  const env = getEnv();
  const h = request.headers.get("authorization");
  const expected = `Bearer ${env.INTERNAL_API_SECRET}`;
  if (h !== expected) throw new UnauthorizedInternal();
}

export class UnauthorizedInternal extends Error {
  constructor(message = "unauthorized_internal") {
    super(message);
    this.name = "UnauthorizedInternal";
  }
}
