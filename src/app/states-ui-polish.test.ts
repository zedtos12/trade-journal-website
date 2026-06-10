import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const loginPage = readFileSync(join(process.cwd(), "src/app/login/page.tsx"), "utf8");
const registerPage = readFileSync(join(process.cwd(), "src/app/register/page.tsx"), "utf8");
const authForm = readFileSync(join(process.cwd(), "src/components/auth-form.tsx"), "utf8");
const settingsPage = readFileSync(join(process.cwd(), "src/app/settings/page.tsx"), "utf8");
const settingsForms = readFileSync(join(process.cwd(), "src/components/settings-forms.tsx"), "utf8");
const settingsLoading = readFileSync(join(process.cwd(), "src/app/settings/loading.tsx"), "utf8");
const tradesLoading = readFileSync(join(process.cwd(), "src/app/trades/loading.tsx"), "utf8");
const tradesError = readFileSync(join(process.cwd(), "src/app/trades/error.tsx"), "utf8");

describe("auth settings loading and error premium polish", () => {
  it("uses premium animated auth surfaces", () => {
    expect(loginPage).toContain('data-testid="auth-page-shell"');
    expect(registerPage).toContain('data-testid="auth-page-shell"');
    expect(authForm).toContain('data-testid="auth-form-card"');
    expect(authForm).toContain("premium-card animate-fade-up");
    expect(authForm).toContain("premium-button");
    expect(authForm).toContain("focus:border-gold/50");
  });

  it("uses premium settings sections", () => {
    expect(settingsPage).toContain('data-testid="settings-page-header"');
    expect(settingsForms).toContain('data-testid="settings-form-card"');
    expect(settingsForms).toContain("premium-card interactive-card animate-fade-up");
    expect(settingsForms).toContain("premium-button");
    expect(settingsForms).toContain("focus:border-gold/50");
  });

  it("uses shimmer loading and premium error states", () => {
    expect(settingsLoading).toContain("animate-shimmer");
    expect(settingsLoading).toContain("premium-card");
    expect(tradesLoading).toContain("animate-shimmer");
    expect(tradesLoading).toContain("premium-card");
    expect(tradesError).toContain('data-testid="trade-error-state"');
    expect(tradesError).toContain("premium-card animate-fade-up");
    expect(tradesError).toContain("premium-button");
  });
});
