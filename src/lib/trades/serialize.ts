import type { Trade } from "@prisma/client";

type Decimalish = { toNumber: () => number } | number | null;
const toNumber = (value: Decimalish) => {
  if (value === null) return null;
  if (typeof value === "number") return value;
  return value.toNumber();
};

export function serializeTrade(trade: Trade) {
  return {
    ...trade,
    openDate: trade.openDate.toISOString(),
    closeDate: trade.closeDate?.toISOString() ?? null,
    entryPrice: toNumber(trade.entryPrice),
    exitPrice: toNumber(trade.exitPrice),
    lotSize: toNumber(trade.lotSize),
    stopLoss: toNumber(trade.stopLoss),
    takeProfit: toNumber(trade.takeProfit),
    profitLossAmount: toNumber(trade.profitLossAmount),
    profitLossPercentage: toNumber(trade.profitLossPercentage),
    riskRewardRatio: toNumber(trade.riskRewardRatio),
    createdAt: trade.createdAt.toISOString(),
    updatedAt: trade.updatedAt.toISOString(),
  };
}

export type SerializedTrade = ReturnType<typeof serializeTrade>;
