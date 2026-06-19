import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { TradeCalendar } from "@/components/trade-calendar";
import { requireUser } from "@/lib/auth";
import { buildMonthlyPerformance } from "@/lib/analytics/dashboard-insights";
import { buildAnalyticsSummary, groupPerformanceByKey } from "@/lib/analytics/performance";
import { prisma } from "@/lib/db";

function SummaryCard({ label, value, tone = "neutral", delay = 0 }: { label: string; value: string | number; tone?: "neutral" | "profit" | "loss"; delay?: number }) {
  const toneClass = tone === "profit" ? "text-emerald-300" : tone === "loss" ? "text-rose-300" : "text-white";
  const accentClass = tone === "profit" ? "from-emerald-400/20" : tone === "loss" ? "from-rose-400/20" : "from-gold/15";
  const borderTone = tone === "profit" ? "border-emerald-500/30" : tone === "loss" ? "border-rose-500/30" : "border-gold/20";
  return (
    <div data-testid="analytics-summary-card" className={`premium-card interactive-card animate-fade-up relative overflow-hidden rounded-3xl border-b-4 ${borderTone} p-6 ${accentClass}`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accentClass} to-transparent`} />
      <p className="relative text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
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
        <p className="mt-5 rounded-xl border border-dashed border-gold/20 bg-gold/[0.03] p-8 text-center text-slate-400">Not enough data</p>
      ) : (
        <div className="mt-5 space-y-2">
          {rows.map((row) => {
            const pnlTone = row.totalPnL >= 0 ? "text-emerald-300" : "text-rose-300";
            return (
              <div key={row.label} data-testid="analytics-performance-row" className="group flex flex-col justify-between gap-2 rounded-xl border border-white/5 bg-slate-950/40 p-4 transition hover:-translate-y-0.5 hover:border-gold/30 hover:bg-slate-900/80 md:flex-row md:items-center">
                <span className="font-semibold text-white">{row.label}</span>
                <div className="flex flex-wrap items-center gap-4 text-sm md:justify-end">
                  <span className="text-slate-400"><strong className="text-slate-300">{row.trades}</strong> trades</span>
                  <span className={`font-semibold tabular-nums ${pnlTone}`}>{row.totalPnL >= 0 ? `+${row.totalPnL}` : row.totalPnL} P/L</span>
                  <span className="w-16 text-right tabular-nums text-goldLight">{row.winRate}% WR</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MiniBars({ rows }: { rows: { label: string; totalPnL: number; trades: number }[] }) {
  if (rows.length === 0) return <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-gold/20 bg-gold/[0.03] text-slate-400">Not enough data</div>;
  const max = Math.max(...rows.map((row) => Math.abs(row.totalPnL)), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const isProfit = row.totalPnL >= 0;
        return (
          <div key={row.label} className="group relative rounded-xl border border-white/5 bg-slate-950/40 p-4 transition hover:border-gold/25 hover:bg-slate-900/60">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-200">{row.label}</span>
              <span className={`font-semibold tabular-nums ${isProfit ? "text-emerald-300" : "text-rose-300"}`}>{isProfit ? `+${row.totalPnL}` : row.totalPnL}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/80 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isProfit ? "bg-gradient-to-r from-emerald-500 to-emerald-300" : "bg-gradient-to-r from-rose-500 to-rose-300"} shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
                style={{ width: `${Math.max(4, (Math.abs(row.totalPnL) / max) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const params = await searchParams;
  const playbookId = typeof params.playbookId === "string" ? params.playbookId : undefined;

  const trades = await prisma.trade.findMany({ 
    where: { userId: user.id, ...(playbookId && { playbookId }) }, 
    orderBy: { openDate: "asc" } 
  });
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
  const calendarTrades = trades.map((trade) => ({
    id: trade.id,
    openDate: trade.openDate.toISOString(),
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
  }));
  const totalTone = summary.totalPnL > 0 ? "profit" : summary.totalPnL < 0 ? "loss" : "neutral";
  const bestPair = byPair[0];
  const bestSetup = bySetup[0];
  const bestSession = bySession[0];

  return (
    <AppShell>
      <section data-testid="analytics-command-center" className="premium-card animate-fade-up relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(244,213,141,0.18),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(45,212,191,0.12),transparent_28%)]" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Pattern lab</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Performance analytics</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Baca pola performa berdasarkan pair, setup, timeframe, session, monthly performance, dan kalender trading dalam workspace analytics yang lebih rapi.</p>
          </div>
          <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
        </div>
      </section>

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

          <section data-testid="analytics-insight-rail" className="premium-card interactive-card animate-fade-up relative mt-6 overflow-hidden rounded-3xl p-6" style={{ animationDelay: "90ms" }}>
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-goldLight">Best signal snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold">Top-performing patterns</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">Based on filtered journal data</span>
            </div>
            <div className="relative mt-5 grid gap-3 md:grid-cols-3">
              <div className="group rounded-xl border border-white/5 bg-slate-950/55 p-4 transition hover:border-emerald-500/30">
                <p className="text-xs text-slate-400">Best pair</p>
                <p className="mt-2 text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">{bestPair?.label ?? "—"}</p>
                <p className="mt-1 text-sm text-emerald-300 tabular-nums">{bestPair ? `${bestPair.totalPnL >= 0 ? `+${bestPair.totalPnL}` : bestPair.totalPnL} P/L · ${bestPair.winRate}% WR` : "Not enough data"}</p>
              </div>
              <div className="group rounded-xl border border-white/5 bg-slate-950/55 p-4 transition hover:border-emerald-500/30">
                <p className="text-xs text-slate-400">Best setup</p>
                <p className="mt-2 text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">{bestSetup?.label ?? "—"}</p>
                <p className="mt-1 text-sm text-emerald-300 tabular-nums">{bestSetup ? `${bestSetup.totalPnL >= 0 ? `+${bestSetup.totalPnL}` : bestSetup.totalPnL} P/L · ${bestSetup.winRate}% WR` : "Not enough data"}</p>
              </div>
              <div className="group rounded-xl border border-white/5 bg-slate-950/55 p-4 transition hover:border-emerald-500/30">
                <p className="text-xs text-slate-400">Best session</p>
                <p className="mt-2 text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">{bestSession?.label ?? "—"}</p>
                <p className="mt-1 text-sm text-emerald-300 tabular-nums">{bestSession ? `${bestSession.totalPnL >= 0 ? `+${bestSession.totalPnL}` : bestSession.totalPnL} P/L · ${bestSession.winRate}% WR` : "Not enough data"}</p>
              </div>
            </div>
          </section>

          <section data-testid="analytics-calendar-section" className="premium-card interactive-card animate-fade-up mt-8 rounded-3xl p-6" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Trading calendar</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Month / year</span>
            </div>
            <TradeCalendar trades={calendarTrades} />
          </section>

          <section data-testid="analytics-monthly-section" className="premium-card interactive-card animate-fade-up mt-6 rounded-3xl p-6" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">Monthly performance</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{monthly.length} months</span>
              </div>
              <div className="mt-5"><MiniBars rows={monthly} /></div>
          </section>

          <div data-testid="analytics-breakdown-grid" className="mt-8 grid gap-6 xl:grid-cols-2">
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
