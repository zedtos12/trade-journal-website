import { z } from "zod";

const optionalText = z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().optional());
const optionalDate = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional());
const pageNumber = z.preprocess((value) => {
  const page = Number(value ?? 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}, z.number().int().positive().default(1));
const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || typeof value === "undefined") return undefined;
  if (typeof value === "string") return Number(value);
  return value;
}, z.number().finite().optional());

export const tradeSchema = z
  .object({
    pair: z.string().trim().min(3, "Pair wajib diisi").max(20).transform((value) => value.toUpperCase()),
    direction: z.enum(["buy", "sell"]),
    status: z.enum(["open", "closed"]).default("closed"),
    openDate: z.string().min(1, "Open date wajib diisi"),
    closeDate: optionalDate,
    entryPrice: optionalNumber,
    exitPrice: optionalNumber,
    lotSize: optionalNumber,
    stopLoss: optionalNumber,
    takeProfit: optionalNumber,
    profitLossAmount: optionalNumber,
    profitLossPercentage: optionalNumber,
    riskRewardRatio: optionalNumber,
    result: z.enum(["win", "loss", "breakeven", "open"]),
    setupName: optionalText,
    playbookId: optionalText,
    timeframe: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"]).optional()),
    session: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["Asia", "London", "NewYork"]).optional()),
    tags: z.preprocess((value) => {
      if (!value || value === "") return [];
      if (typeof value === "string") return value.split(",").map((tag) => tag.trim()).filter(Boolean);
      if (Array.isArray(value)) return value;
      return [];
    }, z.array(z.string()).default([])),
    emotionalState: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["confident", "neutral", "anxious", "fomo", "revenge", "disciplined", "impulsive"]).optional()),
    emotionBefore: optionalText,
    emotionAfter: optionalText,
    entryReason: optionalText,
    exitReason: optionalText,
    lessonLearned: optionalText,
    notes: optionalText,
  })
  .refine((data) => data.status === "open" || data.result !== "open", {
    message: "Result open hanya boleh untuk trade status open",
    path: ["result"],
  })
  .refine((data) => !data.closeDate || new Date(data.closeDate) >= new Date(data.openDate), {
    message: "Close date tidak boleh sebelum open date",
    path: ["closeDate"],
  });

export const tradeQuerySchema = z.object({
  search: z.preprocess((value) => (typeof value === "string" ? value.trim() || undefined : undefined), z.string().optional()),
  result: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["win", "loss", "breakeven", "open"]).optional()),
  direction: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["buy", "sell"]).optional()),
  setup: z.preprocess((value) => (typeof value === "string" ? value.trim() || undefined : undefined), z.string().optional()),
  playbookId: optionalText,
  timeframe: z.preprocess((value) => (value === "" ? undefined : value), z.enum(["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"]).optional()),
  dateFrom: optionalDate,
  dateTo: optionalDate,
  page: pageNumber,
  sort: z.enum(["newest", "oldest", "highest-profit", "biggest-loss"]).optional().default("newest"),
});

export type TradeInput = z.infer<typeof tradeSchema>;
export type TradeQuery = z.infer<typeof tradeQuerySchema>;
