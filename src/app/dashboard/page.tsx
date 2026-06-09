import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { calculateDashboardMetrics } from "@/lib/analytics/metrics";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await requireUser();
  const trades = await prisma.trade.findMany({ where: { userId: user.id }, orderBy: { openDate: "desc" }, take: 5 });
  const metrics = calculateDashboardMetrics(
    trades.map((trade) => ({
      status: trade.status,
      result: trade.result,
      profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
      riskRewardRatio: trade.riskRewardRatio?.toNumber() ?? null,
    })),
  );

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-gold">Good to see you, {user.name}</p>
          <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-slate-400">Quick overview dari trade journal kamu.</p>
        </div>
        <Link href="/trades/new" className="rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Total trades", metrics.totalTrades],
          ["Win rate", `${metrics.winRate}%`],
          ["Total P/L", `${user.preferred_currency} ${metrics.totalPnL}`],
          ["Profit factor", metrics.profitFactor],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Recent trades</h2>
            <p className="mt-2 text-slate-400">Trade terbaru yang sudah kamu catat.</p>
          </div>
          <Link href="/trades" className="text-sm text-gold">View all</Link>
        </div>
        {trades.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">Belum ada trade. Klik Add Trade untuk mulai journaling.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {trades.map((trade) => (
              <Link key={trade.id} href={`/trades/${trade.id}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 hover:bg-white/[0.06]">
                <span className="font-semibold">{trade.pair}</span>
                <span className="capitalize text-slate-300">{trade.result}</span>
                <span>{trade.profitLossAmount?.toString() ?? "—"}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
