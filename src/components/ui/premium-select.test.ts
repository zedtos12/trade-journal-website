import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const selectPath = join(process.cwd(), "src/components/ui/premium-select.tsx");
const selectSource = existsSync(selectPath) ? readFileSync(selectPath, "utf8") : "";
const tradesPage = readFileSync(join(process.cwd(), "src/app/trades/page.tsx"), "utf8");
const tradeForm = readFileSync(join(process.cwd(), "src/components/trade-form.tsx"), "utf8");
const settingsForms = readFileSync(join(process.cwd(), "src/components/settings-forms.tsx"), "utf8");
const calendar = readFileSync(join(process.cwd(), "src/components/trade-calendar.tsx"), "utf8");

describe("premium select dropdown system", () => {
  it("provides a custom dropdown instead of relying on native select popup styling", () => {
    expect(selectSource).toContain('data-testid={dataTestId ?? "premium-select"}');
    expect(selectSource).toContain('data-testid="premium-select-menu"');
    expect(selectSource).toContain("appearance-none");
    expect(selectSource).toContain("bg-slate-950/95");
    expect(selectSource).toContain("hidden");
  });

  it("replaces native selects across main app surfaces", () => {
    for (const source of [tradesPage, tradeForm, settingsForms, calendar]) {
      expect(source).toContain("PremiumSelect");
      expect(source).not.toContain("<select");
    }
  });
});
