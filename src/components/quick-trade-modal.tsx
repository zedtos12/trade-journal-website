"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { PremiumDateInput } from "@/components/ui/premium-date-input";
import { PremiumButton } from "@/components/ui/premium-button";

type QuickTradeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function QuickTradeModal({ open, onClose }: QuickTradeModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepOpen, setKeepOpen] = useState(false);

  if (!open) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.message ?? "Gagal menyimpan trade");
      setLoading(false);
      return;
    }

    // Success
    if (keepOpen) {
      // Reset form
      const form = document.getElementById("quick-trade-form") as HTMLFormElement;
      form?.reset();
      setLoading(false);
      router.refresh();
    } else {
      router.push("/trades");
      router.refresh();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="premium-card w-full max-w-2xl animate-scale-in rounded-3xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Quick Add Trade</h2>
              <p className="mt-1 text-sm text-slate-400">Core fields only — edit later for details</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-white/5"
              aria-label="Close"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}

          {/* Form */}
          <form id="quick-trade-form" action={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                Pair *
                <PremiumInput 
                  name="pair" 
                  required 
                  placeholder="EURUSD" 
                  className="mt-2" 
                />
              </label>

              <label className="text-sm text-slate-300">
                Direction *
                <PremiumSelect 
                  name="direction" 
                  defaultValue="buy" 
                  options={[
                    { value: "buy", label: "Buy" },
                    { value: "sell", label: "Sell" },
                  ]} 
                />
              </label>

              <label className="text-sm text-slate-300">
                Result *
                <PremiumSelect 
                  name="result" 
                  defaultValue="win" 
                  options={[
                    { value: "win", label: "Win" },
                    { value: "loss", label: "Loss" },
                    { value: "breakeven", label: "Breakeven" },
                    { value: "open", label: "Open" },
                  ]} 
                />
              </label>

              <label className="text-sm text-slate-300">
                P/L Amount
                <PremiumInput 
                  name="profitLossAmount" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="mt-2" 
                />
              </label>

              <label className="text-sm text-slate-300">
                Open Date *
                <PremiumDateInput 
                  name="openDate" 
                  required 
                  ariaLabel="Open date" 
                />
              </label>

              <label className="text-sm text-slate-300">
                Setup / Strategy
                <PremiumInput 
                  name="setupName" 
                  placeholder="London breakout" 
                  className="mt-2" 
                />
              </label>

              <label className="text-sm text-slate-300">
                Lot Size
                <PremiumInput 
                  name="lotSize" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.10" 
                  className="mt-2" 
                />
              </label>

              <label className="text-sm text-slate-300">
                Status *
                <PremiumSelect 
                  name="status" 
                  defaultValue="closed" 
                  options={[
                    { value: "closed", label: "Closed" },
                    { value: "open", label: "Open" },
                  ]} 
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <PremiumButton
                type="submit"
                disabled={loading}
                onClick={() => setKeepOpen(true)}
                className="flex-1 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Add Another"}
              </PremiumButton>

              <PremiumButton
                type="submit"
                disabled={loading}
                onClick={() => setKeepOpen(false)}
                className="flex-1 rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Close"}
              </PremiumButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
