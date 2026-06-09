export type InsightTrade = {
  openDate: string | Date;
  pair?: string | null;
  setupName?: string | null;
  profitLossAmount?: number | null;
};

export type PerformanceRow = {
  label: string;
  totalPnL: number;
  trades: number;
};

const round2 = (value: number) => Math.round(value * 100) / 100;
const pnl = (trade: InsightTrade) => trade.profitLossAmount ?? 0;
const asDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

export function buildEquityCurve(trades: InsightTrade[]) {
  let cumulative = 0;
  return [...trades]
    .sort((a, b) => asDate(a.openDate).getTime() - asDate(b.openDate).getTime())
    .map((trade) => {
      const date = asDate(trade.openDate);
      cumulative = round2(cumulative + pnl(trade));
      return {
        label: date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        value: cumulative,
      };
    });
}

export function summarizePerformanceByKey(trades: InsightTrade[], key: "pair" | "setupName") {
  const grouped = new Map<string, PerformanceRow>();

  for (const trade of trades) {
    const label = trade[key]?.trim();
    if (!label) continue;
    const existing = grouped.get(label) ?? { label, totalPnL: 0, trades: 0 };
    existing.totalPnL = round2(existing.totalPnL + pnl(trade));
    existing.trades += 1;
    grouped.set(label, existing);
  }

  const rows = Array.from(grouped.values()).sort((a, b) => b.totalPnL - a.totalPnL);
  return {
    rows,
    best: rows[0] ?? null,
    worst: rows.length ? rows[rows.length - 1] : null,
  };
}

export function buildMonthlyPerformance(trades: InsightTrade[]) {
  const grouped = new Map<string, PerformanceRow & { sortKey: string }>();

  for (const trade of trades) {
    const date = asDate(trade.openDate);
    const sortKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
    const existing = grouped.get(sortKey) ?? { label, totalPnL: 0, trades: 0, sortKey };
    existing.totalPnL = round2(existing.totalPnL + pnl(trade));
    existing.trades += 1;
    grouped.set(sortKey, existing);
  }

  return Array.from(grouped.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((row) => ({ label: row.label, totalPnL: row.totalPnL, trades: row.trades }));
}
