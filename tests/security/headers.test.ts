import { describe, it, expect } from "bun:test";
import { buildSecurityHeaders } from "../../src/server/security/headers";

describe("Security Headers", () => {
  it("generates strict CSP with wasm-unsafe-eval for web assembly", () => {
    const headers = buildSecurityHeaders();
    expect(headers["Content-Security-Policy"]).toBeDefined();
    expect(headers["Content-Security-Policy"]).toContain("'wasm-unsafe-eval'");
    expect(headers["Content-Security-Policy"]).toContain("worker-src 'self' blob:");
  });

  it("includes HSTS and nosniff protections", () => {
    const headers = buildSecurityHeaders();
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
  });
});
