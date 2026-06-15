import { Prisma } from "@prisma/client";
import type { TradeInput } from "@/lib/validation/trade";

const decimalOrNull = (value: number | undefined) => (typeof value === "number" ? new Prisma.Decimal(value) : null);

export function tradeInputToPrismaData(input: TradeInput) {
  return {
    pair: input.pair,
    direction: input.direction,
    status: input.status,
    result: input.status === "open" ? "open" : input.result,
    openDate: new Date(input.openDate),
    closeDate: input.closeDate ? new Date(input.closeDate) : null,
    entryPrice: decimalOrNull(input.entryPrice),
    exitPrice: decimalOrNull(input.exitPrice),
    lotSize: decimalOrNull(input.lotSize),
    stopLoss: decimalOrNull(input.stopLoss),
    takeProfit: decimalOrNull(input.takeProfit),
    profitLossAmount: decimalOrNull(input.profitLossAmount),
    profitLossPercentage: decimalOrNull(input.profitLossPercentage),
    riskRewardRatio: decimalOrNull(input.riskRewardRatio),
    setupName: input.setupName ?? null,
    playbookId: input.playbookId ?? null,
    timeframe: input.timeframe ?? null,
    session: input.session ?? null,
    emotionBefore: input.emotionBefore ?? null,
    emotionAfter: input.emotionAfter ?? null,
    entryReason: input.entryReason ?? null,
    exitReason: input.exitReason ?? null,
    lessonLearned: input.lessonLearned ?? null,
    notes: input.notes ?? null,
  } satisfies Prisma.TradeUncheckedUpdateInput;
}
