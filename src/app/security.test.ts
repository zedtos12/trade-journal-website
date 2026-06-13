import { describe, expect, it, vi } from "vitest";

describe("production security headers", () => {
  it("defines strict security headers for production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    
    // Import after stubbing so isProduction is true
    const nextConfig = (await import("../../next.config")).default;
    const headersConfig = await nextConfig.headers?.();
    const rootHeaders = headersConfig?.find(h => h.source === "/(.*)")?.headers;

    const findHeader = (key: string) => rootHeaders?.find(h => h.key === key)?.value;

    expect(findHeader("X-Frame-Options")).toBe("DENY");
    expect(findHeader("X-Content-Type-Options")).toBe("nosniff");
    expect(findHeader("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(findHeader("Strict-Transport-Security")).toContain("max-age=63072000");
    
    const csp = findHeader("Content-Security-Policy");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    
    vi.unstubAllEnvs();
  });
});
