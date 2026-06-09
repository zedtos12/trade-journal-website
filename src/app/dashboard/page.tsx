import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { calculateDashboardMetrics } from "@/lib/analytics/metrics";
import { buildEquityCurve, buildMonthlyPerformance, summarizePerformanceByKey } from "@/lib/analytics/dashboard-insights";
import { prisma } from "@/lib/db";

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "profit" | "loss" }) {
  const toneClass = tone === "profit" ? "text-emerald-300" : tone === "loss" ? "text-rose-300" : "text-white";
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function InsightCard({ title, row }: { title: string; row: { label: string; totalPnL: number; trades: number } | null }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{title}</p>
      {row ? (
        <div className="mt-3">
          <p className="text-xl font-semibold">{row.label}</p>
          <p className={row.totalPnL >= 0 ? "mt-1 text-emerald-300" : "mt-1 text-rose-300"}>{row.totalPnL} P/L • {row.trades} trades</p>
        </div>
      ) : (
        <p className="mt-3 text-slate-500">Not enough data</p>
      )}
    </div>
  );
}

function EquityCurve({ points }: { points: { label: string; value: number }[] }) {
  if (points.length === 0) {
    return <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-500">Belum ada data equity curve</div>;
  }

  const min = Math.min(...points.map((point) => point.value), 0);
  const max = Math.max(...points.map((point) => point.value), 1);
  const range = max - min || 1;

  return (
    <div className="h-56 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex h-full items-end gap-2">
        {points.map((point, index) => {
          const height = Math.max(8, ((point.value - min) / range) * 100);
          return (
            <div key={`${point.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-gold/80" style={{ height: `${height}%` }} title={`${point.label}: ${point.value}`} />
              <span className="hidden text-[10px] text-slate-500 md:block">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const allTrades = await prisma.trade.findMany({ where: { userId: user.id }, orderBy: { openDate: "desc" } });
  const recentTrades = allTrades.slice(0, 5);
  const metricTrades = allTrades.map((trade) => ({
    status: trade.status,
    result: trade.result,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
    riskRewardRatio: trade.riskRewardRatio?.toNumber() ?? null,
  }));
  const insightTrades = allTrades.map((trade) => ({
    openDate: trade.openDate,
    pair: trade.pair,
    setupName: trade.setupName,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
  }));

  const metrics = calculateDashboardMetrics(metricTrades);
  const equityCurve = buildEquityCurve(insightTrades);
  const pairSummary = summarizePerformanceByKey(insightTrades, "pair");
  const setupSummary = summarizePerformanceByKey(insightTrades, "setupName");
  const monthlyPerformance = buildMonthlyPerformance(insightTrades).slice(-4);
  const totalTone = metrics.totalPnL > 0 ? "profit" : metrics.totalPnL < 0 ? "loss" : "neutral";

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-gold">Good to see you, {user.name}</p>
          <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-slate-400">Insight utama dari trade journal kamu: performa, equity curve, pair, setup, dan monthly summary.</p>
        </div>
        <Link href="/trades/new" className="rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Total trades" value={metrics.totalTrades} />
        <MetricCard label="Win rate" value={`${metrics.winRate}%`} />
        <MetricCard label="Total P/L" value={`${user.preferred_currency} ${metrics.totalPnL}`} tone={totalTone} />
        <MetricCard label="Average win" value={metrics.averageWin} tone="profit" />
        <MetricCard label="Average loss" value={metrics.averageLoss} tone="loss" />
        <MetricCard label="Profit factor" value={metrics.profitFactor} />
        <MetricCard label="Average R:R" value={metrics.averageRiskReward} />
        <MetricCard label="Closed trades" value={metricTrades.filter((trade) => trade.status === "closed").length} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Equity curve</h2>
              <p className="mt-2 text-slate-400">Cumulative P/L berdasarkan urutan trade.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">{equityCurve.length} points</span>
          </div>
          <div className="mt-6"><EquityCurve points={equityCurve} /></div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Monthly summary</h2>
          <div className="mt-5 space-y-3">
            {monthlyPerformance.length === 0 ? <p className="text-slate-500">Not enough data</p> : monthlyPerformance.map((month) => (
              <div key={month.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div><p className="font-semibold">{month.label}</p><p className="text-sm text-slate-500">{month.trades} trades</p></div>
                <p className={month.totalPnL >= 0 ? "text-emerald-300" : "text-rose-300"}>{month.totalPnL}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <InsightCard title="Best pair" row={pairSummary.best} />
        <InsightCard title="Worst pair" row={pairSummary.worst} />
        <InsightCard title="Best setup" row={setupSummary.best} />
        <InsightCard title="Worst setup" row={setupSummary.worst} />
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Recent trades</h2>
            <p className="mt-2 text-slate-400">Trade terbaru yang sudah kamu catat.</p>
          </div>
          <Link href="/trades" className="text-sm text-gold">View all</Link>
        </div>
        {recentTrades.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">Belum ada trade. Klik Add Trade untuk mulai journaling.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentTrades.map((trade) => (
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
