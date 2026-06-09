import { describe, expect, it } from "vitest";
import { buildEquityCurve, buildMonthlyPerformance, summarizePerformanceByKey } from "@/lib/analytics/dashboard-insights";

describe("dashboard insights", () => {
  const trades = [
    { openDate: "2026-01-03T00:00:00.000Z", pair: "EURUSD", setupName: "Breakout", profitLossAmount: 100 },
    { openDate: "2026-01-10T00:00:00.000Z", pair: "GBPUSD", setupName: "Pullback", profitLossAmount: -40 },
    { openDate: "2026-02-02T00:00:00.000Z", pair: "EURUSD", setupName: "Breakout", profitLossAmount: 70 },
    { openDate: "2026-02-08T00:00:00.000Z", pair: "XAUUSD", setupName: null, profitLossAmount: -120 },
    { openDate: "2026-03-01T00:00:00.000Z", pair: "GBPUSD", setupName: "Pullback", profitLossAmount: 30 },
  ];

  it("builds an equity curve from chronological cumulative P/L", () => {
    expect(buildEquityCurve(trades)).toEqual([
      { label: "Jan 03", value: 100 },
      { label: "Jan 10", value: 60 },
      { label: "Feb 02", value: 130 },
      { label: "Feb 08", value: 10 },
      { label: "Mar 01", value: 40 },
    ]);
  });

  it("summarizes best and worst pair by total P/L", () => {
    const summary = summarizePerformanceByKey(trades, "pair");

    expect(summary.best).toEqual({ label: "EURUSD", totalPnL: 170, trades: 2 });
    expect(summary.worst).toEqual({ label: "XAUUSD", totalPnL: -120, trades: 1 });
  });

  it("summarizes best setup and ignores empty setup labels", () => {
    const summary = summarizePerformanceByKey(trades, "setupName");

    expect(summary.best).toEqual({ label: "Breakout", totalPnL: 170, trades: 2 });
    expect(summary.worst).toEqual({ label: "Pullback", totalPnL: -10, trades: 2 });
  });

  it("builds monthly performance summary", () => {
    expect(buildMonthlyPerformance(trades)).toEqual([
      { label: "Jan 2026", totalPnL: 60, trades: 2 },
      { label: "Feb 2026", totalPnL: -50, trades: 2 },
      { label: "Mar 2026", totalPnL: 30, trades: 1 },
    ]);
  });
});
