import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appShell = readFileSync(join(process.cwd(), "src/components/app-shell.tsx"), "utf8");
const logoutButton = readFileSync(join(process.cwd(), "src/components/logout-button.tsx"), "utf8");
const mobileNavbarMenuPath = join(process.cwd(), "src/components/mobile-navbar-menu.tsx");
const mobileNavbarMenu = existsSync(mobileNavbarMenuPath) ? readFileSync(mobileNavbarMenuPath, "utf8") : "";

describe("premium navbar polish", () => {
  it("uses a sticky glass navbar with brand, desktop nav pills, and add trade CTA", () => {
    expect(appShell).toContain('data-testid="premium-navbar"');
    expect(appShell).toContain('data-testid="navbar-brand"');
    expect(appShell).toContain('data-testid="navbar-links"');
    expect(appShell).toContain("hidden lg:flex");
    expect(appShell).toContain("sticky top-0 z-50");
    expect(appShell).toContain("backdrop-blur-xl");
    expect(appShell).toContain("rounded-full border border-white/10");
    expect(appShell).toContain('href="/trades/new"');
    expect(appShell).toContain("Add Trade");
  });

  it("uses a mobile hamburger menu instead of always-visible nav links", () => {
    expect(appShell).toContain("MobileNavbarMenu");
    expect(appShell).toContain('data-testid="mobile-navbar-slot"');
    expect(mobileNavbarMenu).toContain('data-testid="navbar-mobile-toggle"');
    expect(mobileNavbarMenu).toContain('aria-controls="mobile-navigation-menu"');
    expect(mobileNavbarMenu).toContain("aria-expanded={open}");
    expect(mobileNavbarMenu).toContain('data-testid="mobile-navigation-menu"');
    expect(mobileNavbarMenu).toContain("min-h-11");
    expect(mobileNavbarMenu).toContain("setOpen(false)");
  });

  it("keeps logout visually aligned with the premium navigation system", () => {
    expect(logoutButton).toContain('data-testid="navbar-logout"');
    expect(logoutButton).toContain("rounded-full");
    expect(logoutButton).toContain("hover:border-rose-400/40");
    expect(logoutButton).toContain("focus:ring-2 focus:ring-rose-400/30");
  });
});
