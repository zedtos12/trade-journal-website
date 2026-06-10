"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SerializedTrade } from "@/lib/trades/serialize";

type TradeFormProps = {
  mode: "create" | "edit";
  trade?: SerializedTrade;
};

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-sm text-slate-300";
const sectionClass = "premium-card animate-fade-up rounded-3xl p-6";

function valueOrEmpty(value: unknown) {
  return value === null || typeof value === "undefined" ? "" : String(value);
}

function dateValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function TradeForm({ mode, trade }: TradeFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(mode === "create" ? "/api/trades" : `/api/trades/${trade?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.message ?? "Gagal menyimpan trade");
      setLoading(false);
      return;
    }

    router.push(`/trades/${data.trade.id}`);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="animate-fade-up space-y-6">
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Trade Basics</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>Pair<input name="pair" required defaultValue={trade?.pair ?? ""} placeholder="EURUSD" className={inputClass} /></label>
          <label className={labelClass}>Direction<select name="direction" defaultValue={trade?.direction ?? "buy"} className={inputClass}><option value="buy">Buy</option><option value="sell">Sell</option></select></label>
          <label className={labelClass}>Status<select name="status" defaultValue={trade?.status ?? "closed"} className={inputClass}><option value="closed">Closed</option><option value="open">Open</option></select></label>
          <label className={labelClass}>Result<select name="result" defaultValue={trade?.result ?? "win"} className={inputClass}><option value="win">Win</option><option value="loss">Loss</option><option value="breakeven">Breakeven</option><option value="open">Open</option></select></label>
          <label className={labelClass}>Open date<input name="openDate" required type="date" defaultValue={dateValue(trade?.openDate)} className={inputClass} /></label>
          <label className={labelClass}>Close date<input name="closeDate" type="date" defaultValue={dateValue(trade?.closeDate)} className={inputClass} /></label>
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Risk & Result</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[['entryPrice','Entry price'],['exitPrice','Exit price'],['lotSize','Lot size'],['stopLoss','Stop loss'],['takeProfit','Take profit'],['profitLossAmount','P/L amount'],['profitLossPercentage','P/L %'],['riskRewardRatio','Risk/reward ratio']].map(([name,label]) => (
            <label key={name} className={labelClass}>{label}<input name={name} type="number" step="any" defaultValue={valueOrEmpty(trade?.[name as keyof SerializedTrade])} className={inputClass} /></label>
          ))}
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Strategy & Psychology</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>Setup / strategy<input name="setupName" defaultValue={trade?.setupName ?? ""} className={inputClass} placeholder="London breakout" /></label>
          <label className={labelClass}>Timeframe<select name="timeframe" defaultValue={trade?.timeframe ?? ""} className={inputClass}><option value="">Select</option>{["M1","M5","M15","M30","H1","H4","D1","W1"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className={labelClass}>Session<select name="session" defaultValue={trade?.session ?? ""} className={inputClass}><option value="">Select</option><option value="Asia">Asia</option><option value="London">London</option><option value="NewYork">New York</option></select></label>
          <label className={labelClass}>Emotion before<input name="emotionBefore" defaultValue={trade?.emotionBefore ?? ""} className={inputClass} /></label>
          <label className={labelClass}>Emotion after<input name="emotionAfter" defaultValue={trade?.emotionAfter ?? ""} className={inputClass} /></label>
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Notes</h2>
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>Entry reason<textarea name="entryReason" defaultValue={trade?.entryReason ?? ""} className={inputClass} rows={3} /></label>
          <label className={labelClass}>Exit reason<textarea name="exitReason" defaultValue={trade?.exitReason ?? ""} className={inputClass} rows={3} /></label>
          <label className={labelClass}>Mistake / lesson learned<textarea name="lessonLearned" defaultValue={trade?.lessonLearned ?? ""} className={inputClass} rows={3} /></label>
          <label className={labelClass}>General notes<textarea name="notes" defaultValue={trade?.notes ?? ""} className={inputClass} rows={4} /></label>
        </div>
      </section>

      <button disabled={loading} className="premium-button rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight disabled:opacity-60">
        {loading ? "Saving..." : mode === "create" ? "Save Trade" : "Update Trade"}
      </button>
    </form>
  );
}
