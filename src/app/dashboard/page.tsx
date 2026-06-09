import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireUser } from "@/lib/auth";
import { calculateDashboardMetrics } from "@/lib/analytics/metrics";

const emptyMetrics = calculateDashboardMetrics([]);

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-slate-950/70 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="font-semibold">Trade Journal</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/settings">Settings</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-gold">Good to see you, {user.name}</p>
            <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-slate-400">Foundation dashboard sesuai PRD. Trade CRUD masuk tahap berikutnya.</p>
          </div>
          <button className="rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 opacity-60" disabled>
            Add Trade — next phase
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["Total trades", emptyMetrics.totalTrades],
            ["Win rate", `${emptyMetrics.winRate}%`],
            ["Total P/L", `${user.preferred_currency} ${emptyMetrics.totalPnL}`],
            ["Profit factor", emptyMetrics.profitFactor],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="text-2xl font-semibold">Belum ada trade</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Empty state premium sesuai PRD. Di tahap 2 nanti tombol Add Trade akan aktif untuk input manual trade.
          </p>
        </div>
      </section>
    </main>
  );
}
