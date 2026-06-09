import { describe, expect, it } from "vitest";
import { registerSchema, loginSchema } from "@/lib/validation/auth";

describe("auth validation", () => {
  it("accepts valid register payload", () => {
    const parsed = registerSchema.parse({
      name: "Boni Trader",
      email: "boni@example.com",
      password: "strongpass123",
      confirmPassword: "strongpass123",
    });

    expect(parsed.email).toBe("boni@example.com");
  });

  it("rejects mismatched password confirmation", () => {
    expect(() =>
      registerSchema.parse({
        name: "Boni Trader",
        email: "boni@example.com",
        password: "strongpass123",
        confirmPassword: "different123",
      }),
    ).toThrow();
  });

  it("rejects invalid login email", () => {
    expect(() => loginSchema.parse({ email: "not-email", password: "strongpass123" })).toThrow();
  });
});
