import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const analyticsSource = readFileSync(join(process.cwd(), "src/app/analytics/page.tsx"), "utf8");

describe("analytics premium visual polish", () => {
  it("uses premium interactive surfaces for analytics summary and sections", () => {
    expect(analyticsSource).toContain("data-testid=\"analytics-summary-card\"");
    expect(analyticsSource).toContain("premium-card interactive-card animate-fade-up");
    expect(analyticsSource).toContain("data-testid=\"analytics-monthly-section\"");
    expect(analyticsSource).toContain("data-testid=\"analytics-equity-section\"");
    expect(analyticsSource).toContain("data-testid=\"analytics-breakdown-section\"");
  });

  it("keeps the empty analytics state premium and action-oriented", () => {
    expect(analyticsSource).toContain("data-testid=\"analytics-empty-state\"");
    expect(analyticsSource).toContain("premium-button");
    expect(analyticsSource).toContain("Add Trade");
  });
});
