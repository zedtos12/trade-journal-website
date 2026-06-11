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
const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

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

  it("keeps dropdown menus above surrounding cards and uses themed scrollbars", () => {
    expect(selectSource).toContain("z-[90]");
    expect(selectSource).toContain("z-[9999]");
    expect(selectSource).toContain("absolute left-0 top-full");
    expect(selectSource).not.toContain("fixed z-[9999]");
    expect(selectSource).not.toContain("menuPosition");
    expect(selectSource).toContain('data-premium-select-open={open ? "true" : undefined}');
    expect(globals).toContain(':has([data-premium-select-open="true"])');
    expect(selectSource).toContain("premium-select-scrollbar");
    expect(globals).toContain(".premium-select-scrollbar::-webkit-scrollbar");
    expect(globals).toContain("scrollbar-color: rgba(215, 181, 109, 0.7) rgba(15, 23, 42, 0.72)");
  });
});
