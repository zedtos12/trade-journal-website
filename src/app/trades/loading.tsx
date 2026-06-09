import { AppShell } from "@/components/app-shell";

export default function TradesLoading() {
  return (
    <AppShell>
      <div className="animate-pulse">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="mt-4 h-10 w-64 rounded bg-white/10" />
        <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-6">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-12 rounded-2xl bg-white/10" />)}
        </div>
        <div className="mt-8 space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 rounded-2xl bg-white/10" />)}
        </div>
      </div>
    </AppShell>
  );
}
