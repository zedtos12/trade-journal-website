import { describe, expect, it } from "vitest";
import { buildAnalyticsSummary, groupPerformanceByKey } from "@/lib/analytics/performance";

describe("analytics performance helpers", () => {
  const trades = [
    { status: "closed", result: "win", profitLossAmount: 200, riskRewardRatio: 2, pair: "EURUSD", setupName: "Breakout", timeframe: "H1", session: "London" },
    { status: "closed", result: "loss", profitLossAmount: -80, riskRewardRatio: 1, pair: "EURUSD", setupName: "Breakout", timeframe: "H1", session: "London" },
    { status: "closed", result: "loss", profitLossAmount: -40, riskRewardRatio: 1.5, pair: "GBPUSD", setupName: "Pullback", timeframe: "M15", session: "NewYork" },
    { status: "open", result: "open", profitLossAmount: 999, riskRewardRatio: 3, pair: "XAUUSD", setupName: null, timeframe: "H4", session: "Asia" },
  ];

  it("calculates PRD analytics summary including gross profit and gross loss", () => {
    const summary = buildAnalyticsSummary(trades);

    expect(summary.totalTrades).toBe(4);
    expect(summary.closedTrades).toBe(3);
    expect(summary.grossProfit).toBe(200);
    expect(summary.grossLoss).toBe(120);
    expect(summary.totalPnL).toBe(80);
    expect(summary.profitFactor).toBe(1.67);
    expect(summary.winRate).toBe(33.33);
    expect(summary.averageRiskReward).toBe(1.88);
  });

  it("keeps profit factor safe when gross loss is zero", () => {
    const summary = buildAnalyticsSummary([
      { status: "closed", result: "win", profitLossAmount: 50, riskRewardRatio: 2, pair: "EURUSD", setupName: "Breakout", timeframe: "H1", session: "London" },
    ]);

    expect(summary.profitFactor).toBe("∞");
  });

  it("groups performance by pair/setup/timeframe/session", () => {
    expect(groupPerformanceByKey(trades, "pair")[0]).toEqual({ label: "EURUSD", trades: 2, totalPnL: 120, winRate: 50 });
    expect(groupPerformanceByKey(trades, "setupName")[0]).toEqual({ label: "Breakout", trades: 2, totalPnL: 120, winRate: 50 });
    expect(groupPerformanceByKey(trades, "timeframe")[0]).toEqual({ label: "H1", trades: 2, totalPnL: 120, winRate: 50 });
    expect(groupPerformanceByKey(trades, "session")[0]).toEqual({ label: "London", trades: 2, totalPnL: 120, winRate: 50 });
  });
});
