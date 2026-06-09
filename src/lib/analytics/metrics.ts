export type TradeForMetrics = {
  status: "open" | "closed";
  result: "win" | "loss" | "breakeven" | "open";
  profitLossAmount?: number | null;
  riskRewardRatio?: number | null;
};

export type DashboardMetrics = {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number | "N/A" | "∞";
  averageRiskReward: number;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculateDashboardMetrics(trades: TradeForMetrics[]): DashboardMetrics {
  const closedTrades = trades.filter((trade) => trade.status === "closed");
  const wins = closedTrades.filter((trade) => trade.result === "win");

  const pnlValues = closedTrades.map((trade) => trade.profitLossAmount ?? 0);
  const positivePnL = pnlValues.filter((value) => value > 0);
  const negativePnL = pnlValues.filter((value) => value < 0);
  const rrValues = trades
    .map((trade) => trade.riskRewardRatio)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  const grossProfit = positivePnL.reduce((sum, value) => sum + value, 0);
  const grossLoss = Math.abs(negativePnL.reduce((sum, value) => sum + value, 0));
  const totalPnL = pnlValues.reduce((sum, value) => sum + value, 0);

  let profitFactor: DashboardMetrics["profitFactor"] = "N/A";
  if (grossLoss === 0 && grossProfit > 0) profitFactor = "∞";
  if (grossLoss > 0) profitFactor = round2(grossProfit / grossLoss);

  return {
    totalTrades: trades.length,
    winRate: closedTrades.length > 0 ? round2((wins.length / closedTrades.length) * 100) : 0,
    totalPnL: round2(totalPnL),
    averageWin: positivePnL.length ? round2(grossProfit / positivePnL.length) : 0,
    averageLoss: negativePnL.length ? round2(negativePnL.reduce((sum, value) => sum + value, 0) / negativePnL.length) : 0,
    profitFactor,
    averageRiskReward: rrValues.length ? round2(rrValues.reduce((sum, value) => sum + value, 0) / rrValues.length) : 0,
  };
}
