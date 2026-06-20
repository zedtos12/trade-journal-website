"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { PremiumDateInput } from "@/components/ui/premium-date-input";

type CreateGoalFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateGoalForm({ onSuccess, onCancel }: CreateGoalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      targetAmount: parseFloat(formData.get("targetAmount") as string),
      period: formData.get("period") as string,
      startDate: formData.get("startDate") as string,
    };

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to create goal");
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-slate-400">Goal Name</span>
        <PremiumInput 
          name="name" 
          required 
          placeholder="Monthly Profit Target" 
          className="mt-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-400">Target Amount</span>
        <PremiumInput 
          name="targetAmount" 
          type="number" 
          step="0.01" 
          required 
          placeholder="1000.00" 
          className="mt-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-400">Period</span>
        <PremiumSelect 
          name="period" 
          defaultValue="monthly"
          options={[
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "yearly", label: "Yearly" },
          ]}
          className="mt-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-400">Start Date</span>
        <PremiumDateInput 
          name="startDate" 
          required 
          defaultValue={new Date().toISOString().split("T")[0]}
          className="mt-2"
        />
      </label>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-gradient-to-r from-gold to-goldLight px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Goal"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
