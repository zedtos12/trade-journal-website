import { describe, expect, it } from "vitest";
import { tradeSchema, tradeQuerySchema } from "@/lib/validation/trade";

describe("trade validation", () => {
  it("accepts the PRD minimum required manual trade fields", () => {
    const parsed = tradeSchema.parse({
      pair: "eurusd",
      direction: "buy",
      openDate: "2026-06-09",
      result: "win",
    });

    expect(parsed.pair).toBe("EURUSD");
    expect(parsed.status).toBe("closed");
  });

  it("rejects close date before open date", () => {
    expect(() =>
      tradeSchema.parse({
        pair: "GBPUSD",
        direction: "sell",
        openDate: "2026-06-10",
        closeDate: "2026-06-09",
        result: "loss",
      }),
    ).toThrow();
  });

  it("rejects invalid numeric input", () => {
    expect(() =>
      tradeSchema.parse({
        pair: "XAUUSD",
        direction: "buy",
        openDate: "2026-06-09",
        result: "win",
        profitLossAmount: "not-a-number",
      }),
    ).toThrow();
  });

  it("normalizes search and filter query params", () => {
    const parsed = tradeQuerySchema.parse({ search: " gold ", result: "win", sort: "highest-profit" });

    expect(parsed.search).toBe("gold");
    expect(parsed.result).toBe("win");
    expect(parsed.sort).toBe("highest-profit");
  });
});
