import type { Prisma } from "@prisma/client";
import type { TradeQuery } from "@/lib/validation/trade";

export function buildTradeWhere(userId: string, query: Partial<TradeQuery>): Prisma.TradeWhereInput {
  const where: Prisma.TradeWhereInput = { userId };

  if (query.search) {
    where.OR = [
      { pair: { contains: query.search, mode: "insensitive" } },
      { setupName: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.result) where.result = query.result;
  if (query.direction) where.direction = query.direction;
  if (query.timeframe) where.timeframe = query.timeframe;
  if (query.setup) where.setupName = { contains: query.setup, mode: "insensitive" };

  if (query.dateFrom || query.dateTo) {
    where.openDate = {};
    if (query.dateFrom) where.openDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.openDate.lte = new Date(query.dateTo);
  }

  return where;
}

export function buildTradeOrderBy(sort: TradeQuery["sort"] | undefined): Prisma.TradeOrderByWithRelationInput {
  if (sort === "oldest") return { openDate: "asc" };
  if (sort === "highest-profit") return { profitLossAmount: "desc" };
  if (sort === "biggest-loss") return { profitLossAmount: "asc" };
  return { openDate: "desc" };
}
