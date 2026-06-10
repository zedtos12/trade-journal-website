import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { buildEquityCurve, buildMonthlyPerformance } from "@/lib/analytics/dashboard-insights";
import { buildAnalyticsSummary, groupPerformanceByKey } from "@/lib/analytics/performance";
import { prisma } from "@/lib/db";

function SummaryCard({ label, value, tone = "neutral", delay = 0 }: { label: string; value: string | number; tone?: "neutral" | "profit" | "loss"; delay?: number }) {
  const toneClass = tone === "profit" ? "text-emerald-300" : tone === "loss" ? "text-rose-300" : "text-white";
  const accentClass = tone === "profit" ? "from-emerald-400/20" : tone === "loss" ? "from-rose-400/20" : "from-gold/15";
  return (
    <div data-testid="analytics-summary-card" className={`premium-card interactive-card animate-fade-up relative overflow-hidden rounded-3xl p-5 ${accentClass}`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accentClass} to-transparent`} />
      <p className="relative text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function PerformanceTable({ title, rows }: { title: string; rows: { label: string; trades: number; totalPnL: number; winRate: number }[] }) {
  return (
    <section data-testid="analytics-breakdown-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{rows.length} groups</span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-gold/20 bg-gold/[0.03] p-5 text-center text-slate-500">Not enough data</p>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="interactive-card grid grid-cols-2 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm md:grid-cols-4">
              <span className="font-semibold">{row.label}</span>
              <span className="text-slate-400">{row.trades} trades</span>
              <span className={row.totalPnL >= 0 ? "text-emerald-300" : "text-rose-300"}>{row.totalPnL}</span>
              <span className="text-slate-300">{row.winRate}% WR</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MiniBars({ rows }: { rows: { label: string; totalPnL: number; trades: number }[] }) {
  if (rows.length === 0) return <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-gold/20 bg-gold/[0.03] text-slate-500">Not enough data</div>;
  const max = Math.max(...rows.map((row) => Math.abs(row.totalPnL)), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 transition hover:border-gold/25 hover:bg-white/[0.05]">
          <div className="mb-1 flex justify-between text-sm"><span>{row.label}</span><span className={row.totalPnL >= 0 ? "text-emerald-300" : "text-rose-300"}>{row.totalPnL}</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-900"><div className={row.totalPnL >= 0 ? "h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" : "h-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-300"} style={{ width: `${Math.max(6, (Math.abs(row.totalPnL) / max) * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage() {
  const user = await requireUser();
  const trades = await prisma.trade.findMany({ where: { userId: user.id }, orderBy: { openDate: "asc" } });
  const analyticsTrades = trades.map((trade) => ({
    status: trade.status,
    result: trade.result,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
    riskRewardRatio: trade.riskRewardRatio?.toNumber() ?? null,
    pair: trade.pair,
    setupName: trade.setupName,
    timeframe: trade.timeframe,
    session: trade.session,
  }));
  const insightTrades = trades.map((trade) => ({
    openDate: trade.openDate,
    pair: trade.pair,
    setupName: trade.setupName,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
  }));

  const summary = buildAnalyticsSummary(analyticsTrades);
  const byPair = groupPerformanceByKey(analyticsTrades, "pair");
  const bySetup = groupPerformanceByKey(analyticsTrades, "setupName");
  const byTimeframe = groupPerformanceByKey(analyticsTrades, "timeframe");
  const bySession = groupPerformanceByKey(analyticsTrades, "session");
  const monthly = buildMonthlyPerformance(insightTrades);
  const equity = buildEquityCurve(insightTrades);
  const totalTone = summary.totalPnL > 0 ? "profit" : summary.totalPnL < 0 ? "loss" : "neutral";

  return (
    <AppShell>
      <div className="animate-fade-up flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-gold">Analytics MVP</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Performance analytics</h1>
          <p className="mt-2 text-slate-400">Breakdown performa trading berdasarkan PRD: pair, setup, timeframe, session, monthly performance, dan equity curve.</p>
        </div>
        <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
      </div>

      {trades.length === 0 ? (
        <div data-testid="analytics-empty-state" className="premium-card animate-fade-up mt-8 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold">Belum ada data analytics</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Tambahkan beberapa trade dulu supaya analytics bisa menampilkan pola performa kamu.</p>
          <Link href="/trades/new" className="premium-button mt-6 inline-flex rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <SummaryCard label="Total trades" value={summary.totalTrades} delay={0} />
            <SummaryCard label="Closed trades" value={summary.closedTrades} delay={60} />
            <SummaryCard label="Win rate" value={`${summary.winRate}%`} delay={120} />
            <SummaryCard label="Total P/L" value={`${user.preferred_currency} ${summary.totalPnL}`} tone={totalTone} delay={180} />
            <SummaryCard label="Gross profit" value={summary.grossProfit} tone="profit" delay={240} />
            <SummaryCard label="Gross loss" value={summary.grossLoss} tone="loss" delay={300} />
            <SummaryCard label="Profit factor" value={summary.profitFactor} delay={360} />
            <SummaryCard label="Average R:R" value={summary.averageRiskReward} delay={420} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section data-testid="analytics-monthly-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">Monthly performance</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{monthly.length} months</span>
              </div>
              <div className="mt-5"><MiniBars rows={monthly} /></div>
            </section>
            <section data-testid="analytics-equity-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">Equity curve checkpoints</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{equity.length} points</span>
              </div>
              <div className="mt-5"><MiniBars rows={equity.map((point) => ({ label: point.label, totalPnL: point.value, trades: 1 }))} /></div>
            </section>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <PerformanceTable title="Performance by pair" rows={byPair} />
            <PerformanceTable title="Performance by setup" rows={bySetup} />
            <PerformanceTable title="Performance by timeframe" rows={byTimeframe} />
            <PerformanceTable title="Performance by session" rows={bySession} />
          </div>
        </>
      )}
    </AppShell>
  );
}
