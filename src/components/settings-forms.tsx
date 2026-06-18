"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PremiumSelect } from "@/components/ui/premium-select";

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 disabled:opacity-50 disabled:cursor-not-allowed";
const labelClass = "block text-sm text-slate-400 font-medium";
const cardClass = "dropdown-layer premium-card interactive-card animate-fade-up relative overflow-hidden rounded-3xl p-6 md:p-8";

export function SettingsForms({ user }: { user: { name: string; email: string; preferred_currency: string } }) {
  const router = useRouter();
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  async function updateProfile(formData: FormData) {
    setProfileMessage("Saving...");
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    setProfileMessage(response.ok ? "Profile updated" : (await response.json()).message ?? "Failed");
    router.refresh();
  }

  async function updatePassword(formData: FormData) {
    setPasswordMessage("Saving...");
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "password", ...Object.fromEntries(formData.entries()) }),
    });
    setPasswordMessage(response.ok ? "Password updated" : (await response.json()).message ?? "Failed");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form data-testid="settings-form-card" action={updateProfile} className={cardClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-goldLight">Profile info</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Account profile</h2>
        <div className="mt-6 space-y-4">
          <label className={labelClass}>Name<input name="name" required defaultValue={user.name} className={inputClass} /></label>
          <label className={labelClass}>Email<input disabled value={user.email} className={inputClass} /></label>
          <label className={labelClass}>Preferred currency<PremiumSelect name="preferredCurrency" defaultValue={user.preferred_currency} options={[{ value: "USD", label: "USD" }, { value: "IDR", label: "IDR" }]} /></label>
          {profileMessage && <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{profileMessage}</p>}
          <button className="premium-button mt-2 w-full rounded-xl bg-gold px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-gold/10 transition hover:bg-goldLight">Save profile</button>
        </div>
      </form>

      <form data-testid="settings-form-card" action={updatePassword} className={cardClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-goldLight">Security</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Change password</h2>
        <div className="mt-6 space-y-4">
          <label className={labelClass}>Current password<input name="currentPassword" type="password" minLength={8} required className={inputClass} /></label>
          <label className={labelClass}>New password<input name="newPassword" type="password" minLength={8} required className={inputClass} /></label>
          <label className={labelClass}>Confirm new password<input name="confirmPassword" type="password" minLength={8} required className={inputClass} /></label>
          {passwordMessage && <p className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-goldLight">{passwordMessage}</p>}
          <button className="premium-button mt-2 w-full rounded-xl bg-gold px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-gold/10 transition hover:bg-goldLight">Update password</button>
        </div>
      </form>
    </div>
  );
}
