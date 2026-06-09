import { AppShell } from "@/components/app-shell";

export default function SettingsLoading() {
  return (
    <AppShell>
      <div className="animate-pulse">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="mt-4 h-10 w-72 rounded bg-white/10" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.04]" />
          <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.04]" />
        </div>
      </div>
    </AppShell>
  );
}
