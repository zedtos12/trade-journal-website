import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-slate-950/70 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="font-semibold">Trade Journal</Link>
          <LogoutButton />
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-4xl font-semibold">Settings</h1>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Profile info</p>
          <div className="mt-5 space-y-4 text-slate-200">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Preferred currency: {user.preferred_currency}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
