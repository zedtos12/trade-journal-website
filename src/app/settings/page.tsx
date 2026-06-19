import { AppShell } from "@/components/app-shell";
import { SettingsForms } from "@/components/settings-forms";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppShell>
      <div data-testid="settings-page-header" className="premium-card animate-fade-up relative overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(244,213,141,0.15),transparent_30%)]" />
        <div className="relative">
          <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Settings</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Profile & security</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Update preferensi akun, format uang, dan amankan password akun kamu.</p>
        </div>
      </div>
      <div className="mt-8"><SettingsForms user={user} /></div>
    </AppShell>
  );
}
