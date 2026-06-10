import { AppShell } from "@/components/app-shell";
import { SettingsForms } from "@/components/settings-forms";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppShell>
      <div data-testid="settings-page-header" className="animate-fade-up">
        <p className="text-gold">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Profile & security</h1>
        <p className="mt-2 text-slate-400">Update nama, preferred currency, dan password akun.</p>
      </div>
      <div className="mt-8"><SettingsForms user={user} /></div>
    </AppShell>
  );
}
