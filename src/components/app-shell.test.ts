import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appShell = readFileSync(join(process.cwd(), "src/components/app-shell.tsx"), "utf8");
const logoutButton = readFileSync(join(process.cwd(), "src/components/logout-button.tsx"), "utf8");

describe("premium navbar polish", () => {
  it("uses a sticky glass navbar with brand, nav pills, and add trade CTA", () => {
    expect(appShell).toContain('data-testid="premium-navbar"');
    expect(appShell).toContain('data-testid="navbar-brand"');
    expect(appShell).toContain('data-testid="navbar-links"');
    expect(appShell).toContain("sticky top-0 z-50");
    expect(appShell).toContain("backdrop-blur-xl");
    expect(appShell).toContain("rounded-full border border-white/10");
    expect(appShell).toContain('href="/trades/new"');
    expect(appShell).toContain("Add Trade");
  });

  it("keeps logout visually aligned with the premium navigation system", () => {
    expect(logoutButton).toContain('data-testid="navbar-logout"');
    expect(logoutButton).toContain("rounded-full");
    expect(logoutButton).toContain("hover:border-rose-400/40");
    expect(logoutButton).toContain("focus:ring-2 focus:ring-rose-400/30");
  });
});
