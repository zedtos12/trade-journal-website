import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("premium animation foundation", () => {
  it("defines reusable motion utilities for the UI polish stages", () => {
    expect(css).toContain("@keyframes fade-up");
    expect(css).toContain("@keyframes scale-in");
    expect(css).toContain("@keyframes float-slow");
    expect(css).toContain("@keyframes pulse-glow");
    expect(css).toContain("@keyframes shimmer");
    expect(css).toContain(".animate-fade-up");
    expect(css).toContain(".animate-scale-in");
    expect(css).toContain(".animate-float-slow");
    expect(css).toContain(".animate-pulse-glow");
    expect(css).toContain(".animate-shimmer");
  });

  it("defines premium reusable surface and interaction classes", () => {
    expect(css).toContain(".premium-card");
    expect(css).toContain(".interactive-card");
    expect(css).toContain(".premium-button");
    expect(css).toContain(".gold-glow");
    expect(css).toContain(".bg-grid-luxury");
  });

  it("respects reduced motion preferences", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("animation-duration: 1ms !important");
    expect(css).toContain("transition-duration: 1ms !important");
  });
});
