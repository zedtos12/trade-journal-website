import { describe, expect, it } from "vitest";
import { buildTradeWhere, buildTradeOrderBy, buildTradePagination } from "@/lib/trades/query";

describe("trade query helpers", () => {
  it("always scopes trade list queries to the logged-in user", () => {
    const where = buildTradeWhere("user_123", { search: "eur", result: "win", direction: "buy" });

    expect(where.userId).toBe("user_123");
    expect(where.result).toBe("win");
    expect(where.direction).toBe("buy");
    expect(where.OR).toEqual([
      { pair: { contains: "eur", mode: "insensitive" } },
      { setupName: { contains: "eur", mode: "insensitive" } },
    ]);
  });

  it("builds an inclusive date range filter", () => {
    const where = buildTradeWhere("user_123", { dateFrom: "2026-06-01", dateTo: "2026-06-10" });

    expect(where.openDate).toMatchObject({
      gte: new Date("2026-06-01"),
      lte: new Date("2026-06-10T23:59:59.999Z"),
    });
  });

  it("maps PRD sort options to safe Prisma order clauses", () => {
    expect(buildTradeOrderBy("oldest")).toEqual({ openDate: "asc" });
    expect(buildTradeOrderBy("highest-profit")).toEqual({ profitLossAmount: "desc" });
    expect(buildTradeOrderBy("biggest-loss")).toEqual({ profitLossAmount: "asc" });
    expect(buildTradeOrderBy(undefined)).toEqual({ openDate: "desc" });
  });

  it("creates safe limit pagination values", () => {
    expect(buildTradePagination(3)).toEqual({ page: 3, take: 10, skip: 20 });
    expect(buildTradePagination(0)).toEqual({ page: 1, take: 10, skip: 0 });
  });
});
