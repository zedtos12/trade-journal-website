import { describe, expect, it } from "vitest";
import { calculateDashboardMetrics } from "@/lib/analytics/metrics";

describe("dashboard metrics foundation", () => {
  it("returns PRD-compliant empty metrics when user has no trades", () => {
    const metrics = calculateDashboardMetrics([]);

    expect(metrics.totalTrades).toBe(0);
    expect(metrics.winRate).toBe(0);
    expect(metrics.totalPnL).toBe(0);
    expect(metrics.profitFactor).toBe("N/A");
  });

  it("calculates win rate, total P/L, average win, average loss, profit factor, and average R:R", () => {
    const metrics = calculateDashboardMetrics([
      { result: "win", status: "closed", profitLossAmount: 120, riskRewardRatio: 2 },
      { result: "loss", status: "closed", profitLossAmount: -60, riskRewardRatio: 1 },
      { result: "breakeven", status: "closed", profitLossAmount: 0, riskRewardRatio: 1.2 },
      { result: "open", status: "open", profitLossAmount: 999, riskRewardRatio: 3 },
    ]);

    expect(metrics.totalTrades).toBe(4);
    expect(metrics.winRate).toBe(33.33);
    expect(metrics.totalPnL).toBe(60);
    expect(metrics.averageWin).toBe(120);
    expect(metrics.averageLoss).toBe(-60);
    expect(metrics.profitFactor).toBe(2);
    expect(metrics.averageRiskReward).toBe(1.8);
  });
});
