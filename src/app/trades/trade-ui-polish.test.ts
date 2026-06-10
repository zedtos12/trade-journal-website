import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const tradesPage = readFileSync(join(process.cwd(), "src/app/trades/page.tsx"), "utf8");
const tradeForm = readFileSync(join(process.cwd(), "src/components/trade-form.tsx"), "utf8");
const tradeDetail = readFileSync(join(process.cwd(), "src/app/trades/[id]/page.tsx"), "utf8");
const deleteButton = readFileSync(join(process.cwd(), "src/components/delete-trade-button.tsx"), "utf8");

describe("trade history and forms premium polish", () => {
  it("uses premium interactive surfaces on trade history", () => {
    expect(tradesPage).toContain("data-testid=\"trade-filter-panel\"");
    expect(tradesPage).toContain("data-testid=\"trade-history-table\"");
    expect(tradesPage).toContain("data-testid=\"trade-history-empty-state\"");
    expect(tradesPage).toContain("premium-card interactive-card animate-fade-up");
    expect(tradesPage).toContain("premium-button");
  });

  it("uses premium sections and focusable form fields in trade forms", () => {
    expect(tradeForm).toContain("data-testid=\"trade-form-section\"");
    expect(tradeForm).toContain("premium-card animate-fade-up");
    expect(tradeForm).toContain("premium-button");
    expect(tradeForm).toContain("focus:border-gold/50");
  });

  it("uses premium cards and action buttons on trade detail", () => {
    expect(tradeDetail).toContain("data-testid=\"trade-detail-hero\"");
    expect(tradeDetail).toContain("data-testid=\"trade-detail-section\"");
    expect(tradeDetail).toContain("premium-card interactive-card animate-fade-up");
    expect(tradeDetail).toContain("premium-button");
    expect(deleteButton).toContain("premium-button");
  });
});
