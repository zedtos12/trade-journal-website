import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const analyticsSource = readFileSync(join(process.cwd(), "src/app/analytics/page.tsx"), "utf8");
const calendarPath = join(process.cwd(), "src/components/trade-calendar.tsx");
const calendarSource = existsSync(calendarPath) ? readFileSync(calendarPath, "utf8") : "";

describe("analytics calendar replacement", () => {
  it("removes equity checkpoint UI from analytics", () => {
    expect(analyticsSource).not.toContain("Equity curve checkpoints");
    expect(analyticsSource).not.toContain("analytics-equity-section");
    expect(analyticsSource).not.toContain("buildEquityCurve");
  });

  it("renders a modern interactive calendar section instead", () => {
    expect(analyticsSource).toContain("TradeCalendar");
    expect(analyticsSource).toContain('data-testid="analytics-calendar-section"');
    expect(analyticsSource).toContain("Trading calendar");
  });

  it("calendar supports month and year navigation controls", () => {
    expect(calendarSource).toContain('data-testid="trade-calendar"');
    expect(calendarSource).toContain('data-testid="calendar-prev-month"');
    expect(calendarSource).toContain('data-testid="calendar-next-month"');
    expect(calendarSource).toContain('data-testid="calendar-month-select"');
    expect(calendarSource).toContain('data-testid="calendar-year-select"');
    expect(calendarSource).toContain("useState");
  });
});
