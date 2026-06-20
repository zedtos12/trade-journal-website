"use client";

import { useRouter } from "next/navigation";
import { PremiumButton } from "@/components/ui/premium-button";
import { PremiumInput, PremiumTextarea } from "@/components/ui/premium-input";
import { useEffect, useState } from "react";
import { PremiumDateInput } from "@/components/ui/premium-date-input";
import { PremiumSelect } from "@/components/ui/premium-select";
import type { SerializedTrade } from "@/lib/trades/serialize";

type Playbook = { id: string; name: string };

type TradeFormProps = {
  mode: "create" | "edit";
  trade?: SerializedTrade;
};

const labelClass = "block text-sm text-slate-400 font-medium";
const sectionClass = "dropdown-layer premium-card animate-fade-up relative overflow-hidden rounded-3xl p-6";

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
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  useEffect(() => {
    fetch("/api/playbooks")
      .then((res) => res.json())
      .then((data) => setPlaybooks(data.playbooks || []))
      .catch(() => {});
  }, []);

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
      {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <section data-testid="trade-form-section" className={sectionClass}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(244,213,141,0.08),transparent_40%)]" />
        <h2 className="text-xl font-semibold tracking-tight">Trade Basics</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Playbook / Session
            <PremiumSelect
              name="playbookId"
              defaultValue={trade?.playbookId ?? ""}
              options={[{ value: "", label: "General Journal" }, ...playbooks.map((p) => ({ value: p.id, label: p.name }))]}
            />
          </label>
          <label className={labelClass}>Pair<PremiumInput name="pair" required defaultValue={trade?.pair ?? ""} placeholder="EURUSD" className="mt-2" /></label>
          <label className={labelClass}>Direction<PremiumSelect name="direction" defaultValue={trade?.direction ?? "buy"} options={[{ value: "buy", label: "Buy" }, { value: "sell", label: "Sell" }]} /></label>
          <label className={labelClass}>Status<PremiumSelect name="status" defaultValue={trade?.status ?? "closed"} options={[{ value: "closed", label: "Closed" }, { value: "open", label: "Open" }]} /></label>
          <label className={labelClass}>Result<PremiumSelect name="result" defaultValue={trade?.result ?? "win"} options={[{ value: "win", label: "Win" }, { value: "loss", label: "Loss" }, { value: "breakeven", label: "Breakeven" }, { value: "open", label: "Open" }]} /></label>
          <label className={labelClass}>Open date<PremiumDateInput name="openDate" required defaultValue={dateValue(trade?.openDate)} ariaLabel="Open date" /></label>
          <label className={labelClass}>Close date<PremiumDateInput name="closeDate" defaultValue={dateValue(trade?.closeDate)} ariaLabel="Close date" /></label>
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Risk & Result</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[['entryPrice','Entry price'],['exitPrice','Exit price'],['lotSize','Lot size'],['stopLoss','Stop loss'],['takeProfit','Take profit'],['profitLossAmount','P/L amount'],['profitLossPercentage','P/L %'],['riskRewardRatio','Risk/reward ratio']].map(([name,label]) => (
            <label key={name} className={labelClass}>{label}<PremiumInput name={name} type="number" step="any" defaultValue={valueOrEmpty(trade?.[name as keyof SerializedTrade])} className="mt-2" /></label>
          ))}
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Strategy & Psychology</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>Setup / strategy<PremiumInput name="setupName" defaultValue={trade?.setupName ?? ""} className="mt-2" placeholder="London breakout" /></label>
          <label className={labelClass}>Timeframe<PremiumSelect name="timeframe" defaultValue={trade?.timeframe ?? ""} options={[{ value: "", label: "Select" }, ...["M1","M5","M15","M30","H1","H4","D1","W1"].map((item) => ({ value: item, label: item }))]} /></label>
          <label className={labelClass}>Session<PremiumSelect name="session" defaultValue={trade?.session ?? ""} options={[{ value: "", label: "Select" }, { value: "Asia", label: "Asia" }, { value: "London", label: "London" }, { value: "NewYork", label: "New York" }]} /></label>
          <label className={labelClass}>
            Tags
            <PremiumInput 
              name="tags" 
              defaultValue={trade?.tags?.join(", ") ?? ""} 
              className="mt-2" 
              placeholder="fomo, revenge-trade, patient-entry (comma-separated)" 
            />
            <p className="mt-1 text-xs text-slate-500">Pisahkan dengan koma untuk multiple tags</p>
          </label>
          <label className={labelClass}>
            Emotional State
            <PremiumSelect 
              name="emotionalState" 
              defaultValue={trade?.emotionalState ?? ""} 
              options={[
                { value: "", label: "Select" },
                { value: "confident", label: "😎 Confident" },
                { value: "neutral", label: "😐 Neutral" },
                { value: "anxious", label: "😰 Anxious" },
                { value: "fomo", label: "😱 FOMO" },
                { value: "revenge", label: "😡 Revenge" },
                { value: "disciplined", label: "🎯 Disciplined" },
                { value: "impulsive", label: "⚡ Impulsive" },
              ]} 
            />
          </label>
          <label className={labelClass}>Emotion before<PremiumInput name="emotionBefore" defaultValue={trade?.emotionBefore ?? ""} className="mt-2" /></label>
          <label className={labelClass}>Emotion after<PremiumInput name="emotionAfter" defaultValue={trade?.emotionAfter ?? ""} className="mt-2" /></label>
        </div>
      </section>

      <section data-testid="trade-form-section" className={sectionClass}>
        <h2 className="text-xl font-semibold tracking-tight">Notes</h2>
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>Entry reason<PremiumTextarea name="entryReason" defaultValue={trade?.entryReason ?? ""} className="mt-2" rows={3} /></label>
          <label className={labelClass}>Exit reason<PremiumTextarea name="exitReason" defaultValue={trade?.exitReason ?? ""} className="mt-2" rows={3} /></label>
          <label className={labelClass}>Mistake / lesson learned<PremiumTextarea name="lessonLearned" defaultValue={trade?.lessonLearned ?? ""} className="mt-2" rows={3} /></label>
          <label className={labelClass}>General notes<PremiumTextarea name="notes" defaultValue={trade?.notes ?? ""} className="mt-2" rows={4} /></label>
        </div>
      </section>

      <PremiumButton disabled={loading} className="premium-button inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-slate-950 hover:bg-goldLight disabled:opacity-60 transition-all shadow-[0_4px_20px_rgba(217,180,94,0.15)]">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            {mode === "create" ? "Save Trade" : "Update Trade"}
          </>
        )}
      </PremiumButton>
    </form>
  );
}
