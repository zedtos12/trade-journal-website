import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dashboardSource = readFileSync(join(process.cwd(), "src/app/dashboard/page.tsx"), "utf8");

describe("dashboard premium interaction polish", () => {
  it("uses the shared premium visual system for key dashboard surfaces", () => {
    expect(dashboardSource).toContain("data-testid=\"dashboard-metric-card\"");
    expect(dashboardSource).toContain("premium-card interactive-card animate-fade-up");
    expect(dashboardSource).toContain("data-testid=\"dashboard-equity-section\"");
    expect(dashboardSource).toContain("data-testid=\"dashboard-recent-trades\"");
    expect(dashboardSource).toContain("premium-button");
  });

  it("keeps dashboard empty state guided and action-oriented", () => {
    expect(dashboardSource).toContain("data-testid=\"dashboard-empty-state\"");
    expect(dashboardSource).toContain("Catat trade pertama");
    expect(dashboardSource).toContain("Add Trade");
  });

  it("renders equity curve as a high-contrast visible SVG chart", () => {
    expect(dashboardSource).toContain('data-testid="dashboard-equity-chart"');
    expect(dashboardSource).toContain("<svg");
    expect(dashboardSource).toContain("stroke-goldLight");
    expect(dashboardSource).toContain("<circle");
    expect(dashboardSource).not.toContain("bg-gradient-to-t from-gold/70 to-goldLight");
  });

  it("shows equity value tooltip when hovering chart points", () => {
    expect(dashboardSource).toContain('data-testid="dashboard-equity-tooltip"');
    expect(dashboardSource).toContain("group-hover:opacity-100");
    expect(dashboardSource).toContain("point.value");
    expect(dashboardSource).toContain("P/L");
  });
});
