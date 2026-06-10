import { describe, expect, it } from "vitest";
import { passwordChangeSchema, profileSettingsSchema } from "@/lib/validation/settings";

describe("settings validation", () => {
  it("accepts profile name and preferred currency updates", () => {
    const parsed = profileSettingsSchema.parse({ name: "Boni Trader", preferredCurrency: "IDR" });

    expect(parsed).toEqual({ name: "Boni Trader", preferredCurrency: "IDR" });
  });

  it("rejects unsupported preferred currency", () => {
    expect(() => profileSettingsSchema.parse({ name: "Boni", preferredCurrency: "EUR" })).toThrow();
  });

  it("accepts valid password changes", () => {
    const parsed = passwordChangeSchema.parse({
      currentPassword: "oldpass123",
      newPassword: "newpass123",
      confirmPassword: "newpass123",
    });

    expect(parsed.newPassword).toBe("newpass123");
  });

  it("rejects mismatched new password confirmation", () => {
    expect(() =>
      passwordChangeSchema.parse({
        currentPassword: "oldpass123",
        newPassword: "newpass123",
        confirmPassword: "different123",
      }),
    ).toThrow();
  });
});
