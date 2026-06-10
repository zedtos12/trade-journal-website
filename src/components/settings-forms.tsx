"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-gold/40 focus:ring-2";

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
      <form action={updateProfile} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-slate-400">Profile info</p>
        <h2 className="mt-2 text-2xl font-semibold">Account profile</h2>
        <div className="mt-5 space-y-4">
          <label className="block text-sm text-slate-300">Name<input name="name" required defaultValue={user.name} className={inputClass} /></label>
          <label className="block text-sm text-slate-300">Email<input disabled value={user.email} className={`${inputClass} opacity-60`} /></label>
          <label className="block text-sm text-slate-300">Preferred currency<select name="preferredCurrency" defaultValue={user.preferred_currency} className={inputClass}><option value="USD">USD</option><option value="IDR">IDR</option></select></label>
          {profileMessage && <p className="text-sm text-gold">{profileMessage}</p>}
          <button className="rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Save profile</button>
        </div>
      </form>

      <form action={updatePassword} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-slate-400">Security</p>
        <h2 className="mt-2 text-2xl font-semibold">Change password</h2>
        <div className="mt-5 space-y-4">
          <label className="block text-sm text-slate-300">Current password<input name="currentPassword" type="password" minLength={8} required className={inputClass} /></label>
          <label className="block text-sm text-slate-300">New password<input name="newPassword" type="password" minLength={8} required className={inputClass} /></label>
          <label className="block text-sm text-slate-300">Confirm new password<input name="confirmPassword" type="password" minLength={8} required className={inputClass} /></label>
          {passwordMessage && <p className="text-sm text-gold">{passwordMessage}</p>}
          <button className="rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Update password</button>
        </div>
      </form>
    </div>
  );
}
