export type AnalyticsTrade = {
  status: string;
  result: string;
  profitLossAmount?: number | null;
  riskRewardRatio?: number | null;
  pair?: string | null;
  setupName?: string | null;
  timeframe?: string | null;
  session?: string | null;
};

export type PerformanceGroupKey = "pair" | "setupName" | "timeframe" | "session";

const round2 = (value: number) => Math.round(value * 100) / 100;
const pnl = (trade: AnalyticsTrade) => trade.profitLossAmount ?? 0;

export function buildAnalyticsSummary(trades: AnalyticsTrade[]) {
  const closedTrades = trades.filter((trade) => trade.status === "closed");
  const wins = closedTrades.filter((trade) => trade.result === "win");
  const positive = closedTrades.map(pnl).filter((value) => value > 0);
  const negative = closedTrades.map(pnl).filter((value) => value < 0);
  const grossProfit = positive.reduce((sum, value) => sum + value, 0);
  const grossLoss = Math.abs(negative.reduce((sum, value) => sum + value, 0));
  const totalPnL = closedTrades.reduce((sum, trade) => sum + pnl(trade), 0);
  const rrValues = trades
    .map((trade) => trade.riskRewardRatio)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  return {
    totalTrades: trades.length,
    closedTrades: closedTrades.length,
    grossProfit: round2(grossProfit),
    grossLoss: round2(grossLoss),
    totalPnL: round2(totalPnL),
    profitFactor: grossLoss === 0 ? (grossProfit > 0 ? "∞" : "N/A") : round2(grossProfit / grossLoss),
    winRate: closedTrades.length ? round2((wins.length / closedTrades.length) * 100) : 0,
    averageWin: positive.length ? round2(grossProfit / positive.length) : 0,
    averageLoss: negative.length ? round2(negative.reduce((sum, value) => sum + value, 0) / negative.length) : 0,
    averageRiskReward: rrValues.length ? round2(rrValues.reduce((sum, value) => sum + value, 0) / rrValues.length) : 0,
  };
}

export function groupPerformanceByKey(trades: AnalyticsTrade[], key: PerformanceGroupKey) {
  const grouped = new Map<string, { label: string; trades: number; wins: number; totalPnL: number }>();

  for (const trade of trades) {
    if (trade.status !== "closed") continue;
    const label = trade[key]?.trim();
    if (!label) continue;
    const existing = grouped.get(label) ?? { label, trades: 0, wins: 0, totalPnL: 0 };
    existing.trades += 1;
    existing.wins += trade.result === "win" ? 1 : 0;
    existing.totalPnL = round2(existing.totalPnL + pnl(trade));
    grouped.set(label, existing);
  }

  return Array.from(grouped.values())
    .map((row) => ({
      label: row.label,
      trades: row.trades,
      totalPnL: row.totalPnL,
      winRate: row.trades ? round2((row.wins / row.trades) * 100) : 0,
    }))
    .sort((a, b) => b.totalPnL - a.totalPnL);
}
