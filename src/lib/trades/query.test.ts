import { describe, expect, it } from "vitest";
import { buildTradeWhere, buildTradeOrderBy } from "@/lib/trades/query";

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

  it("maps PRD sort options to safe Prisma order clauses", () => {
    expect(buildTradeOrderBy("oldest")).toEqual({ openDate: "asc" });
    expect(buildTradeOrderBy("highest-profit")).toEqual({ profitLossAmount: "desc" });
    expect(buildTradeOrderBy("biggest-loss")).toEqual({ profitLossAmount: "asc" });
    expect(buildTradeOrderBy(undefined)).toEqual({ openDate: "desc" });
  });
});
